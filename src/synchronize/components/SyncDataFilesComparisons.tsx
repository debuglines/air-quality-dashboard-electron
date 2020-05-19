import React from 'react'
import { FileEntry, getRemoteFileData } from '../remoteSyncHelpers'
import { LocalFileMetadata, saveDataFile } from '../localDiskHelpers'
import { canBeSyncedSafely } from '../syncHelpers'
import NodeSSH from 'node-ssh'

type Props = {
  remoteFilesMetadata: FileEntry[]
  localFilesMetadata: LocalFileMetadata[]
  connectFn: () => Promise<NodeSSH>
}

const SyncDataFilesComparison: React.FC<Props> = (props) => {
  const { remoteFilesMetadata, localFilesMetadata, connectFn } = props
  const localFilesIndex = new Map<string, LocalFileMetadata>(
    localFilesMetadata.map((i) => [i.filename, i]),
  )

  const canAllBeSynced = remoteFilesMetadata.every((remoteFileEntry) => {
    const localFileMetadata = localFilesIndex.get(remoteFileEntry.filename)
    return canBeSyncedSafely(remoteFileEntry, localFileMetadata)
  })

  const handleSyncAllFiles = async () => {
    const remoteFilenames = remoteFilesMetadata.map(
      (metadata) => metadata.filename,
    )
    const fileDataList = await getRemoteFileData(
      await connectFn(),
      remoteFilenames,
    )
    fileDataList.map((fileData) => {
      saveDataFile(fileData.filename, fileData.data)
    })
  }

  return (
    <section>
      {canAllBeSynced && (
        <div>
          <p>All files can be synced safely</p>
          <button onClick={handleSyncAllFiles}>Sync file to local disk</button>
        </div>
      )}

      <ul>
        {remoteFilesMetadata.map((remoteFileEntry) => {
          const localFileMetadata = localFilesIndex.get(
            remoteFileEntry.filename,
          )
          const canBeSynced = canBeSyncedSafely(
            remoteFileEntry,
            localFileMetadata,
          )

          return (
            <li key={remoteFileEntry.filename}>
              <span>{remoteFileEntry.filename}</span>
              <br />
              <span>
                {canBeSynced ? 'Can be synced safely' : 'unable to be synced'}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default SyncDataFilesComparison
