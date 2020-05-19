import NodeSSH from 'node-ssh'

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
): Promise<FileEntry[]> {
  const sftp = await connection.requestSFTP()
  const remotePath = './.air-quality/data'

  return new Promise((resolve, reject) => {
    sftp.readdir(remotePath, (err, data) => {
      if (err) {
        return reject(err)
      }

      return resolve(data)
    })
  })
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

  const FilePromises = remoteFilenames.map((remoteFilename) => {
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

  return Promise.all(FilePromises)
}
