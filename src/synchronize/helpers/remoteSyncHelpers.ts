import NodeSSH from 'node-ssh'
import { generateChecksum, SyncFileMetadata } from './syncHelpers'

const ssh = new NodeSSH()

export function connectSsh(
  host: string,
  username: string,
  password: string,
  port: number,
): Promise<NodeSSH> {
  return ssh.connect({
    host,
    username,
    password,
    port,
  })
}

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

export async function remoteDataFileMetadata(
  connection: NodeSSH,
): Promise<SyncFileMetadata[]> {
  const sftp = await connection.requestSFTP()
  const remotePath = './.air-quality/data'

  const awaitedData = await new Promise<SyncFileMetadata[]>(
    (resolve, reject) => {
      sftp.readdir(remotePath, (err, dataList) => {
        if (err) {
          return reject(err)
        }
        const metadataList: Promise<SyncFileMetadata>[] = dataList.map((data) =>
          remoteFileMetadataMapper(connection, data, remotePath),
        )

        return resolve(Promise.all(metadataList))
      })
    },
  )

  sftp.end()

  return awaitedData
}

async function remoteFileMetadataMapper(
  connection: NodeSSH,
  fileEntry: FileEntry,
  remoteDirPath: string,
): Promise<SyncFileMetadata> {
  const fileData: string = (
    await getRemoteFileData(connection, [fileEntry.filename])
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
  connection: NodeSSH,
  remoteFilenames: string[],
): Promise<RemoteFileData[]> {
  const sftp = await connection.requestSFTP()
  const remoteDirPath = './.air-quality/data'

  const filePromises = remoteFilenames.map((remoteFilename) => {
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

  const awaitedData = await Promise.all(filePromises)
  sftp.end()

  return awaitedData
}
