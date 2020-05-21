import { createDomain } from 'effector'
import NodeSSH from 'node-ssh'
import { SensorData } from '../../sensor/domain/sensorData'
import { resultError, resultOk } from '../helpers/helpers'
import { Result } from '../types'
import {
  connectRemoteAction,
  loadAllSensorDataAction,
  loadLatestSensorDataAction,
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

export const connectRemote = AirQualityDomain.createEffect<
  {
    host: string
    port: number
    username: string
    password: string
  },
  NodeSSH | undefined
>({
  handler: connectRemoteAction,
})

type StoreType = {
  latestSensorData: Result<SensorData> | undefined
  allSensorDataResult: Result<SensorData[]> | undefined
  remoteConnection: NodeSSH | undefined
}

const initialState: StoreType = {
  latestSensorData: undefined,
  allSensorDataResult: undefined,
  remoteConnection: undefined,
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
  .on(connectRemote.doneData, (state, connection) => {
    return { ...state, remoteConnection: connection }
  })

loadLatestSensorData()
loadAllSensorData()

export default AirQualityStore
