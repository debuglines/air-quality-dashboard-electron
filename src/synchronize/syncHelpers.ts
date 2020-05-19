import isAfter from 'date-fns/isAfter'
import { LocalFileMetadata } from './localDiskHelpers'
import { FileEntry } from './remoteSyncHelpers'

export function canBeSyncedSafely(
  remoteFileMetadata: FileEntry,
  localFileMetadata?: LocalFileMetadata,
): boolean {
  if (localFileMetadata === undefined) {
    return true
  }
  const localModifiedDate = localFileMetadata.modifiedDate
  const remoteModifiedDate = new Date(remoteFileMetadata.attrs.mtime)

  return isAfter(remoteModifiedDate, localModifiedDate)
}
