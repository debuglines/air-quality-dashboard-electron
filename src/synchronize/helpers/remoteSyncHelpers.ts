import { Client, SFTPWrapper } from 'ssh2'
import { RemoteConnectionConfig } from '../types'
import { generateChecksum, SyncFileMetadata } from './syncHelpers'

export type Attributes = {
  mode: number
  uid: number
  gid: number
  size: number
  atime: number
  mtime: number
}

export type FileEntry = {
  filename: string
  longname: string
  attrs: Attributes
}

export async function remoteReady<T>(
  connectionConfig: RemoteConnectionConfig,
  callback?: (client: Client) => Promise<T>,
): Promise<T> {
  const client = new Client()
  const promiseResult = new Promise<T>((resolve, reject) => {
    client.on('ready', () => {
      if (callback === undefined) {
        return resolve()
      }
      const result = callback(client)
      return resolve(result)
    })

    client.connect(connectionConfig)
  })

  const promiseError = new Promise<T>((resolve, reject) => {
    client.on('error', (error) => {
      reject(error)
    })
  })

  const result = await Promise.race([promiseResult, promiseError])
  client.end()
  return result
}

export async function remoteSftp<T>(
  connectionConfig: RemoteConnectionConfig,
  callback: (sftp: SFTPWrapper) => Promise<T>,
): Promise<T> {
  return remoteReady(connectionConfig, (client) => {
    return new Promise((resolve, reject) => {
      client.sftp((err, sftp) => {
        if (err) {
          return reject(err)
        }
        const result = callback(sftp)
        return resolve(result)
      })
    })
  })
}

export async function remoteDataFileMetadata(
  sftp: SFTPWrapper,
): Promise<SyncFileMetadata[]> {
  const remotePath = './.air-quality/data'

  return new Promise((resolve, reject) => {
    sftp.readdir(remotePath, (err, dataList) => {
      if (err) {
        return reject(err)
      }
      const metadataList: Promise<SyncFileMetadata>[] = dataList.map((data) =>
        remoteFileMetadataMapper(sftp, data, remotePath),
      )

      return resolve(Promise.all(metadataList))
    })
  })
}

async function remoteFileMetadataMapper(
  sftp: SFTPWrapper,
  fileEntry: FileEntry,
  remoteDirPath: string,
): Promise<SyncFileMetadata> {
  const fileData: string = (
    await getRemoteFileData(sftp, [fileEntry.filename])
  )[0].data

  const checksum = generateChecksum(fileData)

  return {
    filename: fileEntry.filename,
    checksum,
    fullPath: `${remoteDirPath}/${fileEntry.filename}`,
    modifiedDate: new Date(fileEntry.attrs.mtime),
  }
}

export type RemoteFileData = {
  filename: string
  data: string
}

export async function getRemoteFileData(
  sftp: SFTPWrapper,
  remoteFilenames: string[],
): Promise<RemoteFileData[]> {
  const remoteDirPath = './.air-quality/data'

  const data = remoteFilenames.map((remoteFilename) => {
    const remoteFilePath = `${remoteDirPath}/${remoteFilename}`

    return new Promise<RemoteFileData>((resolve, reject) => {
      sftp.readFile(remoteFilePath, { encoding: 'utf8' }, (err, data) => {
        if (err) {
          return reject(err)
        }
        // Sftp type has issues when given an encoding. Data is string
        const encodedData = (data as unknown) as string
        return resolve({
          filename: remoteFilename,
          data: encodedData,
        })
      })
    })
  })

  return Promise.all(data)
}
