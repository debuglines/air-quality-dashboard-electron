import { SyncFileMetadata } from './helpers/syncHelpers'

export type MixedSyncMetadata = {
  remoteMetadata: SyncFileMetadata
  localMetadata?: SyncFileMetadata
  canBeSyncedSafely: boolean
  alreadySyncedEqual: boolean
}
