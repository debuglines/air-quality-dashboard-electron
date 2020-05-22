import { useStore } from 'effector-react'
import { css } from 'emotion'
import React, { useState } from 'react'
import Form from '../../app/shared/components/form/Form'
import InputField from '../../app/shared/components/form/InputField'
import AirQualityStore, { storeConnectionConfig } from '../../app/store/store'
import commonStyles from '../../app/theme/commonStyles'
import { remoteReady } from '../helpers/remoteSyncHelpers'

type Props = {}

const RemoteConnectWidget: React.FC<Props> = (props) => {
  const { remoteConnectionConfig } = useStore(AirQualityStore)

  const [host, setHost] = useState<undefined | string>('raspberrypi')
  const [username, setUsername] = useState<undefined | string>('pi')
  const [password, setPassword] = useState<string>('')
  const [port, setPort] = useState<undefined | number>(22)
  const [pending, setPending] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)

  const handleSubmit = async () => {
    if (
      host === undefined ||
      username === undefined ||
      password === '' ||
      port === undefined
    ) {
      return
    }
    setPending(true)
    setHasError(false)

    const connectionConfig = { host, port, username, password }

    try {
      await remoteReady(connectionConfig)
      await storeConnectionConfig(connectionConfig)
    } catch (err) {
      console.error(err)
      setHasError(true)
    } finally {
      setPending(false)
    }
  }

  if (remoteConnectionConfig) {
    return (
      <div>
        <p>Has validated connection config</p>
      </div>
    )
  }

  return (
    <Form>
      <div className={css(commonStyles.flexRowWrap)}>
        <InputField
          label="Username"
          type="text"
          value={username}
          onValueChange={(event) => setUsername(event.currentTarget.value)}
        />
        <InputField
          label="Host"
          type="text"
          value={host}
          onValueChange={(event) => setHost(event.currentTarget.value)}
        />

        <InputField
          label="Port"
          type="number"
          value={port}
          onValueChange={(event) => setPort(event.currentTarget.valueAsNumber)}
        />

        <InputField
          label="Password"
          type="password"
          value={password}
          onValueChange={(event) => setPassword(event.currentTarget.value)}
        />
      </div>

      <div className={css(commonStyles.flexRowWrap)}>
        <button type="submit" onClick={handleSubmit}>
          Connect
        </button>

        {pending && <p>Connecting &hellip;</p>}

        {hasError && <p>Error connecting to ssh</p>}
      </div>
    </Form>
  )
}

export default RemoteConnectWidget
