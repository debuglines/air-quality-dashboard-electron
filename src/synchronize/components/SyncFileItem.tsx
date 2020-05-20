import { css } from 'emotion'
import React from 'react'
import { typedStyles } from '../../app/theme/styleHelpers'
import { MixedSyncMetadata } from '../types'

type Props = {
  mixedMetadata: MixedSyncMetadata
  checked: boolean
  onCheckToggle: (filename: string) => void
}

const SyncFileItem: React.FC<Props> = (props) => {
  const { mixedMetadata, checked, onCheckToggle } = props
  const {
    remoteMetadata,
    localMetadata,
    canBeSyncedSafely,
    alreadySyncedEqual,
  } = mixedMetadata

  const handleCheckToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    onCheckToggle(value)
  }

  return (
    <li className={css(styles.listItem)}>
      <p>{remoteMetadata.filename}</p>
      <div>
        <label>
          <input
            type="checkbox"
            checked={checked}
            value={remoteMetadata.filename}
            onChange={handleCheckToggle}
          />
          <span>Sync file</span>
        </label>
      </div>
      {localMetadata === undefined && <p>Remote file only</p>}
      {localMetadata !== undefined && alreadySyncedEqual === true && (
        <p>✔ File already synced and checksum matches</p>
      )}

      <p>
        {canBeSyncedSafely
          ? '✔ safe sync '
          : '⚠ Files are different. The remote file is probably updated'}
      </p>
    </li>
  )
}

const styles = typedStyles({
  listItem: {
    paddingTop: '12px',
    paddingBottom: '12px',
  },
})

export default SyncFileItem
