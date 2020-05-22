import { useStore } from 'effector-react'
import React from 'react'
import AirQualityStore from '../../app/store/store'
import RemoteConnectWidget from './RemoteConnectWidget'
import SyncDataFilesComparison from './SyncDataFilesComparisons'

type Props = {}

const SynchronizeScreen: React.FC<Props> = (props) => {
  const { remoteConnectionConfig } = useStore(AirQualityStore)

  return (
    <div>
      <RemoteConnectWidget />

      {remoteConnectionConfig === undefined && (
        <div>
          <h2>Sync files</h2>
          <p>ℹ Log in to remote to sync files</p>
        </div>
      )}

      {remoteConnectionConfig !== undefined && (
        <SyncDataFilesComparison connectionConfig={remoteConnectionConfig} />
      )}
    </div>
  )
}

export default SynchronizeScreen
