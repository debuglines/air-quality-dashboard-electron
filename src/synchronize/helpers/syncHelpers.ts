import crypto from 'crypto'

export type SyncFileMetadata = {
  fullPath: string
  filename: string
  modifiedDate: Date
  checksum: string
}

export function canBeSyncedSafely(
  remoteFileMetadata: SyncFileMetadata,
  localFileMetadata?: SyncFileMetadata,
): boolean {
  if (localFileMetadata === undefined) {
    return true
  }
  const localChecksum = localFileMetadata.checksum
  const remoteChecksum = remoteFileMetadata.checksum

  return localChecksum === remoteChecksum
}

export function generateChecksum(data: string) {
  return crypto.createHash('md5').update(data, 'utf8').digest('hex')
}
