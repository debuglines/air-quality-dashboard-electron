import { useStore } from 'effector-react'
import { css } from 'emotion'
import React, { useState } from 'react'
import Form from '../../app/shared/components/form/Form'
import InputField from '../../app/shared/components/form/InputField'
import AirQualityStore, { connectRemote } from '../../app/store/store'
import commonStyles from '../../app/theme/commonStyles'

type Props = {}

const RemoteConnectWidget: React.FC<Props> = (props) => {
  const { remoteConnection } = useStore(AirQualityStore)

  const [host, setHost] = useState<undefined | string>('raspberrypi')
  const [username, setUsername] = useState<undefined | string>('pi')
  const [password, setPassword] = useState<string>('')
  const [port, setPort] = useState<undefined | number>(22)
  const [pending, setPending] = useState<boolean>(false)

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
    await connectRemote({ host, port, username, password })
    setPending(false)
  }

  if (remoteConnection) {
    return (
      <div>
        <p>Connected to remote</p>
      </div>
    )
  }

  return (
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

      <div className={css(commonStyles.flexRowWrap)}>
        <button type="submit" onClick={handleSubmit}>
          Connect
        </button>

        {pending && <p>Connecting &hellip;</p>}
      </div>
    </Form>
  )
}

export default RemoteConnectWidget
