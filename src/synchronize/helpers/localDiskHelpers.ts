import { promises as fs } from 'fs'
import { join } from 'path'
import { LOCAL_BASE_DATA_DIR_PATH_FULL } from '../../sensor/parser'
import { generateChecksum, SyncFileMetadata } from './syncHelpers'

export async function getLocalDataFilesMetadata(): Promise<SyncFileMetadata[]> {
  const localDataPath = LOCAL_BASE_DATA_DIR_PATH_FULL
  const filenames = await fs.readdir(localDataPath)
  const fileMetadataPromises = filenames.map<Promise<SyncFileMetadata>>(
    async (filename) => {
      const fullPath = join(localDataPath, filename)
      const stat = await fs.stat(fullPath)
      const checksum = await getLocalChecksum(fullPath)

      return {
        fullPath,
        filename,
        checksum,
        modifiedDate: stat.mtime,
      }
    },
  )

  return Promise.all(fileMetadataPromises)
}

export async function saveDataFile(
  filename: string,
  fileData: string,
): Promise<void> {
  const filepath = join(LOCAL_BASE_DATA_DIR_PATH_FULL, filename)
  fs.writeFile(filepath, fileData, { encoding: 'utf8' })
}

async function getLocalChecksum(filepath: string): Promise<string> {
  const fileData = await fs.readFile(filepath, { encoding: 'utf8' })
  return generateChecksum(fileData)
}
