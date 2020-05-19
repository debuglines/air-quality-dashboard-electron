import { promises as fs } from 'fs'
import { join } from 'path'
import { LOCAL_BASE_DATA_DIR_PATH_FULL } from '../sensor/parser'

export type LocalFileMetadata = {
  fullPath: string
  filename: string
  modifiedDate: Date
}

export async function getLocalDataFilesMetadata(): Promise<
  LocalFileMetadata[]
> {
  const localDataPath = LOCAL_BASE_DATA_DIR_PATH_FULL
  const filenames = await fs.readdir(localDataPath)
  const fileMetadataPromises = filenames.map((filename) => {
    const fullPath = join(localDataPath, filename)
    return fs.stat(fullPath).then((stat) => ({
      fullPath,
      filename,
      modifiedDate: stat.mtime,
    }))
  })

  return Promise.all(fileMetadataPromises)
}

export async function saveDataFile(
  filename: string,
  fileData: string,
): Promise<void> {
  const filepath = join(LOCAL_BASE_DATA_DIR_PATH_FULL, filename)
  fs.writeFile(filepath, fileData, { encoding: 'utf8' })
}
