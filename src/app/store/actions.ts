import {
  LOCAL_BASE_DATA_DIR_PATH_FULL,
  parseAllSensorDataFromDir,
  parseLatestSensorDataFromDir,
} from '../../sensor/parser'
import { RemoteConnectionConfig } from '../../synchronize/types'

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

export async function storeConnectionConfigAction(
  params: RemoteConnectionConfig,
) {
  const { host, port, username, password } = params
  if (
    host.trim() === '' ||
    username.trim() === '' ||
    password.trim() === '' ||
    port < 0
  ) {
    return undefined
  }

  return params
}
