import { useStore } from 'effector-react'
import React from 'react'
import AirQualityStore from '../../app/store/store'
import RemoteConnectWidget from './RemoteConnectWidget'
import SyncDataFilesComparison from './SyncDataFilesComparisons'

type Props = {}

const SynchronizeScreen: React.FC<Props> = (props) => {
  const { remoteConnection } = useStore(AirQualityStore)

  return (
    <div>
      <RemoteConnectWidget />

      {remoteConnection === undefined && (
        <div>
          <h2>Sync files</h2>
          <p>ℹ Log in to remote to sync files</p>
        </div>
      )}

      {remoteConnection !== undefined && (
        <SyncDataFilesComparison connection={remoteConnection} />
      )}
    </div>
  )
}

export default SynchronizeScreen
