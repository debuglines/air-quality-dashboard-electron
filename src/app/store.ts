import { createDomain } from 'effector'
import { SensorData } from '../sensor/domain/sensorData'
import {
  LOCAL_BASE_DATA_DIR_PATH_FULL,
  parseLatestSensorDataFromDir,
} from '../sensor/parser'
import { resultError, resultOk } from './helpers'
import { Result } from './types'

export const AirQualityDomain = createDomain()

export const loadLatestSensorData = AirQualityDomain.createEffect<
  undefined,
  SensorData | undefined
>({
  async handler() {
    const sensorData = await parseLatestSensorDataFromDir(
      LOCAL_BASE_DATA_DIR_PATH_FULL,
    )
    return sensorData
  },
})

type StoreType = {
  latestSensorData: Result<SensorData> | undefined
}

const initialState: StoreType = {
  latestSensorData: undefined,
}

const AirQualityStore = AirQualityDomain.store<StoreType>(initialState).on(
  loadLatestSensorData.doneData,
  (state, sensorData) => {
    if (sensorData === undefined) {
      return { ...state, latestSensorData: resultError() }
    }

    return { ...state, latestSensorData: resultOk(sensorData) }
  },
)

export default AirQualityStore
