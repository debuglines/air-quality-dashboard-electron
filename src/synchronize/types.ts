import { SyncFileMetadata } from './helpers/syncHelpers'

export type MixedSyncMetadata = {
  remoteMetadata: SyncFileMetadata
  localMetadata?: SyncFileMetadata
  canBeSyncedSafely: boolean
  alreadySyncedEqual: boolean
}

export type RemoteConnectionConfig = {
  host: string
  username: string
  password: string
  port: number
}
