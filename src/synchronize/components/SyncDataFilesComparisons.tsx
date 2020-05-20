import NodeSSH from 'node-ssh'
import React, { createRef, useEffect, useState } from 'react'
import { loadAllSensorData, loadLatestSensorData } from '../../app/store/store'
import {
  getLocalDataFilesMetadata,
  saveDataFile,
} from '../helpers/localDiskHelpers'
import {
  getRemoteFileData,
  remoteDataFileMetadata,
} from '../helpers/remoteSyncHelpers'
import {
  canBeSyncedSafely as canBeSyncedSafelyCheck,
  SyncFileMetadata,
} from '../helpers/syncHelpers'
import { MixedSyncMetadata } from '../types'
import SyncFileItem from './SyncFileItem'

type Props = {
  connection: NodeSSH
}

const SyncDataFilesComparison: React.FC<Props> = (props) => {
  const { connection } = props

  const [remoteMetadataList, setRemoteMetadataList] = useState<
    undefined | SyncFileMetadata[]
  >(undefined)
  const [localMetadataList, setLocalMetadataList] = useState<
    undefined | SyncFileMetadata[]
  >(undefined)

  const updateLocal = async () => {
    const localMetadata = await getLocalDataFilesMetadata()
    setLocalMetadataList(localMetadata)
  }

  const updateRemote = async () => {
    const fileEntries = await remoteDataFileMetadata(connection)

    setRemoteMetadataList(fileEntries)
  }

  useEffect(() => {
    let updateState = true
    const runLocal = async () => {
      const localMetadata = await getLocalDataFilesMetadata()
      if (updateState) {
        setLocalMetadataList(localMetadata)
      }
    }

    const runRemote = async () => {
      const fileEntries = await remoteDataFileMetadata(connection)

      if (updateState) {
        setRemoteMetadataList(fileEntries)
      }
    }

    runLocal()
    runRemote()

    return () => {
      updateState = false
    }
  }, [connection])

  const localFilesIndex = new Map<string, SyncFileMetadata>(
    (localMetadataList || []).map((i) => [i.filename, i]),
  )
  const checkboxListRef = createRef<HTMLUListElement>()

  const canAllBeSynced = (remoteMetadataList || []).every((remoteFileEntry) => {
    const localFileMetadata = localFilesIndex.get(remoteFileEntry.filename)
    return canBeSyncedSafelyCheck(remoteFileEntry, localFileMetadata)
  })

  const allFullySynced = (remoteMetadataList || []).every(
    (remoteMetadataItem) => {
      const localFileMetadata = localFilesIndex.get(remoteMetadataItem.filename)
      if (localFileMetadata === undefined) {
        return false
      }

      return remoteMetadataItem.checksum === localFileMetadata.checksum
    },
  )

  const sortedRemoteMetadataList = (remoteMetadataList || []).sort((a, b) =>
    a.filename.localeCompare(b.filename),
  )

  const mixedSyncMetadataList: MixedSyncMetadata[] = sortedRemoteMetadataList.map(
    (remoteMetadata) => {
      const localMetadata = localFilesIndex.get(remoteMetadata.filename)
      const canBeSyncedSafely = canBeSyncedSafelyCheck(
        remoteMetadata,
        localMetadata,
      )

      const alreadySyncedEqual =
        localMetadata?.checksum === remoteMetadata.checksum

      return {
        remoteMetadata,
        localMetadata,
        canBeSyncedSafely,
        alreadySyncedEqual,
      }
    },
  )

  type FilteredMetadataLists = {
    unsyncedMetadataList: MixedSyncMetadata[]
    syncedFullyMetadataList: MixedSyncMetadata[]
  }

  const {
    unsyncedMetadataList,
    syncedFullyMetadataList,
  } = mixedSyncMetadataList.reduce<FilteredMetadataLists>(
    (prev, curr) => {
      if (curr.alreadySyncedEqual) {
        prev.syncedFullyMetadataList.push(curr)
      } else {
        prev.unsyncedMetadataList.push(curr)
      }

      return prev
    },
    {
      unsyncedMetadataList: [],
      syncedFullyMetadataList: [],
    },
  )

  const defaultCheckedFilenames = mixedSyncMetadataList
    .filter((data) => data.localMetadata === undefined)
    .map((data) => data.remoteMetadata.filename)

  const [filenamesCheckedForSync, setFilenamesCheckedForSync] = useState<
    string[]
  >(defaultCheckedFilenames)

  const handleSyncAllFiles = async () => {
    if (filenamesCheckedForSync.length === 0) {
      return
    }

    const fileDataList = await getRemoteFileData(
      connection,
      filenamesCheckedForSync,
    )
    const savedPromises = fileDataList.map((fileData) => {
      saveDataFile(fileData.filename, fileData.data)
    })

    await Promise.all(savedPromises)
    loadLatestSensorData()
    loadAllSensorData()
    updateLocal()
    updateRemote()
  }

  const handleCheckToggle = (value: string) => {
    let updatedList = undefined
    if (filenamesCheckedForSync.find((filename) => filename === value)) {
      updatedList = filenamesCheckedForSync.filter(
        (filename) => filename !== value,
      )
    } else {
      updatedList = [...filenamesCheckedForSync]
      updatedList.push(value)
    }

    setFilenamesCheckedForSync(updatedList)
  }

  return (
    <section>
      <div>
        <h2>Sync selected files</h2>
        {allFullySynced && <p>✔ All files are synced</p>}
        {allFullySynced === false && canAllBeSynced && (
          <p>✔ All files can be synced safely</p>
        )}
        <button onClick={handleSyncAllFiles}>Sync file to local disk</button>
      </div>

      <ul ref={checkboxListRef}>
        {unsyncedMetadataList.map((mixedMetadata) => {
          const { remoteMetadata } = mixedMetadata

          const checked =
            filenamesCheckedForSync.some(
              (filename) => filename === remoteMetadata.filename,
            ) ?? false

          const key = remoteMetadata.filename

          return (
            <SyncFileItem
              key={key}
              mixedMetadata={mixedMetadata}
              checked={checked}
              onCheckToggle={handleCheckToggle}
            />
          )
        })}

        <li>
          <hr />
        </li>

        {syncedFullyMetadataList.map((mixedMetadata) => {
          const { remoteMetadata } = mixedMetadata

          const checked =
            filenamesCheckedForSync.some(
              (filename) => filename === remoteMetadata.filename,
            ) ?? false

          const key = remoteMetadata.filename

          return (
            <SyncFileItem
              key={key}
              mixedMetadata={mixedMetadata}
              checked={checked}
              onCheckToggle={handleCheckToggle}
            />
          )
        })}
      </ul>
    </section>
  )
}

export default SyncDataFilesComparison
