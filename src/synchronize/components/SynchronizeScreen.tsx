import React, { useState } from 'react'
import {
  connectSsh,
  remoteDataFileMetadata,
  FileEntry,
} from '../remoteSyncHelpers'
import InputField from '../../app/shared/components/form/InputField'
import Form from '../../app/shared/components/form/Form'
import {
  getLocalDataFilesMetadata,
  LocalFileMetadata,
} from '../localDiskHelpers'
import SyncDataFilesComparison from './SyncDataFilesComparisons'
import { Stats } from 'fs'

type Props = {}

const SynchronizeScreen: React.FC<Props> = (props) => {
  const [host, setHost] = useState<undefined | string>('raspberrypi')
  const [username, setUsername] = useState<undefined | string>('pi')
  const [password, setPassword] = useState<undefined | string>(undefined)
  const [port, setPort] = useState<undefined | number>(22)

  const [remoteFileEntries, setRemoteFileEntries] = useState<
    undefined | FileEntry[]
  >(undefined)
  const [localMetadata, setLocalMetadata] = useState<
    undefined | LocalFileMetadata[]
  >(undefined)

  const handleSubmit = async () => {
    if (
      host === undefined ||
      username === undefined ||
      password === undefined ||
      port === undefined
    ) {
      return
    }
    getLocalDataFilesMetadata().then((localMetadata) =>
      setLocalMetadata(localMetadata),
    )
    const fileEntries = await remoteDataFileMetadata(
      await connectSsh(host, username, password, port),
    )

    setRemoteFileEntries(fileEntries)
  }

  // TODO: propper form
  // TODO: proper reusable elements
  return (
    <div>
      <Form>
        <InputField
          label="Host"
          type="text"
          value={host}
          onValueChange={(event) => setHost(event.currentTarget.value)}
        />

        <InputField
          label="Username"
          type="text"
          value={username}
          onValueChange={(event) => setUsername(event.currentTarget.value)}
        />

        <InputField
          label="Password"
          type="password"
          value={password}
          onValueChange={(event) => setPassword(event.currentTarget.value)}
        />

        <InputField
          label="Port"
          type="number"
          value={port}
          onValueChange={(event) => setPort(event.currentTarget.valueAsNumber)}
        />

        <button type="submit" onClick={handleSubmit}>
          Connect
        </button>
      </Form>

      {host !== undefined &&
        username !== undefined &&
        password !== undefined &&
        port !== undefined && (
          <section>
            <h2>Remote file entries metadata</h2>

            {remoteFileEntries !== undefined && localMetadata !== undefined && (
              <SyncDataFilesComparison
                remoteFilesMetadata={remoteFileEntries}
                localFilesMetadata={localMetadata}
                connectFn={() => connectSsh(host, username, password, port)}
              />
            )}
          </section>
        )}
    </div>
  )
}

export default SynchronizeScreen
