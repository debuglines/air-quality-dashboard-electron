import { createDomain } from 'effector'
import { SensorData } from '../../sensor/domain/sensorData'
import { RemoteConnectionConfig } from '../../synchronize/types'
import { resultError, resultOk } from '../helpers/helpers'
import { Result } from '../types'
import {
  loadAllSensorDataAction,
  loadLatestSensorDataAction,
  storeConnectionConfigAction,
} from './actions'

export const AirQualityDomain = createDomain()

export const loadLatestSensorData = AirQualityDomain.createEffect<
  void,
  SensorData | undefined
>({
  handler: loadLatestSensorDataAction,
})

export const loadAllSensorData = AirQualityDomain.createEffect<
  void,
  Result<SensorData[]> | undefined
>({
  handler: loadAllSensorDataAction,
})

export const storeConnectionConfig = AirQualityDomain.createEffect<
  RemoteConnectionConfig,
  RemoteConnectionConfig | undefined
>({
  handler: storeConnectionConfigAction,
})

type StoreType = {
  latestSensorData: Result<SensorData> | undefined
  allSensorDataResult: Result<SensorData[]> | undefined
  remoteConnectionConfig: RemoteConnectionConfig | undefined
}

const initialState: StoreType = {
  latestSensorData: undefined,
  allSensorDataResult: undefined,
  remoteConnectionConfig: undefined,
}

const AirQualityStore = AirQualityDomain.store<StoreType>(initialState)
  .on(loadLatestSensorData.doneData, (state, sensorData) => {
    if (sensorData === undefined) {
      return { ...state, latestSensorData: resultError() }
    }

    return { ...state, latestSensorData: resultOk(sensorData) }
  })
  .on(loadAllSensorData.doneData, (state, sensorDataResult) => {
    return { ...state, allSensorDataResult: sensorDataResult }
  })
  .on(storeConnectionConfig.doneData, (state, connection) => {
    return { ...state, remoteConnectionConfig: connection }
  })

loadLatestSensorData()
loadAllSensorData()

export default AirQualityStore
