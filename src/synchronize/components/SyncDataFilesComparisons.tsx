import React, { createRef, useEffect, useState } from 'react'
import { loadAllSensorData, loadLatestSensorData } from '../../app/store/store'
import {
  getLocalDataFilesMetadata,
  saveDataFile,
} from '../helpers/localDiskHelpers'
import {
  getRemoteFileData,
  remoteDataFileMetadata,
  remoteSftp,
} from '../helpers/remoteSyncHelpers'
import {
  canBeSyncedSafely as canBeSyncedSafelyCheck,
  SyncFileMetadata,
} from '../helpers/syncHelpers'
import { MixedSyncMetadata, RemoteConnectionConfig } from '../types'
import SyncFileItem from './SyncFileItem'

type Props = {
  connectionConfig: RemoteConnectionConfig
}

const SyncDataFilesComparison: React.FC<Props> = (props) => {
  const { connectionConfig } = props

  const [remoteMetadataList, setRemoteMetadataList] = useState<
    undefined | SyncFileMetadata[]
  >(undefined)
  const [localMetadataList, setLocalMetadataList] = useState<
    undefined | SyncFileMetadata[]
  >(undefined)
  const [hasError, setHasError] = useState<boolean>(false)
  const [pending, setPending] = useState<boolean>(false)

  const updateLocal = async () => {
    const localMetadata = await getLocalDataFilesMetadata()
    setLocalMetadataList(localMetadata)
  }

  const updateRemote = async () => {
    const fileEntries = await remoteSftp(
      connectionConfig,
      remoteDataFileMetadata,
    )

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
      try {
        setHasError(false)
        const fileEntries = await remoteSftp(
          connectionConfig,
          remoteDataFileMetadata,
        )

        if (updateState) {
          setRemoteMetadataList(fileEntries)
        }
      } catch (error) {
        console.error(error)
        if (updateState) {
          setHasError(true)
        }
      }
    }

    setPending(true)
    Promise.all([runLocal(), runRemote()]).then(() => {
      if (updateState) {
        setPending(false)
      }
    })

    return () => {
      updateState = false
    }
  }, [connectionConfig])

  const localFilesIndex = new Map<string, SyncFileMetadata>(
    localMetadataList?.map((i) => [i.filename, i]),
  )
  const checkboxListRef = createRef<HTMLUListElement>()

  const canAllBeSynced = remoteMetadataList?.every((remoteFileEntry) => {
    const localFileMetadata = localFilesIndex.get(remoteFileEntry.filename)
    return canBeSyncedSafelyCheck(remoteFileEntry, localFileMetadata)
  })

  const allFullySynced = remoteMetadataList?.every((remoteMetadataItem) => {
    const localFileMetadata = localFilesIndex.get(remoteMetadataItem.filename)
    if (localFileMetadata === undefined) {
      return false
    }

    return remoteMetadataItem.checksum === localFileMetadata.checksum
  })

  const sortedRemoteMetadataList = remoteMetadataList?.sort((a, b) =>
    a.filename.localeCompare(b.filename),
  )

  const mixedSyncMetadataList:
    | undefined
    | MixedSyncMetadata[] = sortedRemoteMetadataList?.map((remoteMetadata) => {
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
  })

  type FilteredMetadataLists = {
    unsyncedMetadataList: MixedSyncMetadata[]
    syncedFullyMetadataList: MixedSyncMetadata[]
  }

  const splitList = mixedSyncMetadataList?.reduce<FilteredMetadataLists>(
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
    ?.filter((data) => data.localMetadata === undefined)
    .map((data) => data.remoteMetadata.filename)

  const [filenamesCheckedForSync, setFilenamesCheckedForSync] = useState<
    string[]
  >(defaultCheckedFilenames || [])

  const handleSyncAllFiles = async () => {
    if (filenamesCheckedForSync.length === 0) {
      return
    }

    setPending(true)

    const fileDataList = await remoteSftp(connectionConfig, (sftp) =>
      getRemoteFileData(sftp, filenamesCheckedForSync),
    )
    const savedPromises = fileDataList.map((fileData) => {
      return saveDataFile(fileData.filename, fileData.data)
    })

    await Promise.all(savedPromises)

    await Promise.all([
      loadLatestSensorData(),
      loadAllSensorData(),
      updateLocal(),
      updateRemote(),
    ])

    setPending(false)
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
  const unsyncedMetadataList = splitList?.unsyncedMetadataList
  const syncedFullyMetadataList = splitList?.syncedFullyMetadataList

  return (
    <section>
      <div>
        <h2>Sync selected files</h2>
        {allFullySynced && <p>✔ All files are synced</p>}
        {allFullySynced === false && canAllBeSynced && (
          <p>✔ All files can be synced safely</p>
        )}
        <button onClick={handleSyncAllFiles}>Sync file to local disk</button>
        {pending && <p>Pending ...</p>}
      </div>

      {hasError && (
        <div>
          <p>Remote error</p>
          <button
            onClick={() => {
              updateRemote()
              updateLocal()
            }}
          >
            Try to refresh remote files list
          </button>
        </div>
      )}

      <ul ref={checkboxListRef}>
        {unsyncedMetadataList?.map((mixedMetadata) => {
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

        {syncedFullyMetadataList?.map((mixedMetadata) => {
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
