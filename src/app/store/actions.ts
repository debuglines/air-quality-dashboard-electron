import {
  LOCAL_BASE_DATA_DIR_PATH_FULL,
  parseAllSensorDataFromDir,
  parseLatestSensorDataFromDir,
} from '../../sensor/parser'
import { connectSsh } from '../../synchronize/helpers/remoteSyncHelpers'

export async function loadLatestSensorDataAction() {
  const sensorData = await parseLatestSensorDataFromDir(
    LOCAL_BASE_DATA_DIR_PATH_FULL,
  )
  return sensorData
}

export async function loadAllSensorDataAction() {
  const sensorDataResult = await parseAllSensorDataFromDir(
    LOCAL_BASE_DATA_DIR_PATH_FULL,
  )
  return sensorDataResult
}

export async function connectRemoteAction(params: {
  host: string
  port: number
  username: string
  password: string
}) {
  const { host, port, username, password } = params
  if (host.trim() === '' || username.trim() === '' || password.trim() === '') {
    return undefined
  }

  const connection = await connectSsh(host, username, password, port)
  return connection
}
