import { createDomain } from 'effector'
import { SensorData } from './domain/sensorData'
import { Result } from '../app/types'
import { parseLatestSensorDataFromDir } from './parser'
import { BASE_DATA_DIR_PATH } from './parser'
import { resultError, resultOk } from '../app/helpers'

export const AirQualityDomain = createDomain()

export const loadLatestSensorData = AirQualityDomain.createEffect<
  undefined,
  SensorData | undefined
>({
  async handler() {
    const sensorData = await parseLatestSensorDataFromDir(BASE_DATA_DIR_PATH)
    return sensorData
  },
})

const initialLatestSensorDataState = null
export const LatestSensorData = AirQualityDomain.store<null | Result<
  SensorData
>>(initialLatestSensorDataState).on(
  loadLatestSensorData.doneData,
  (state, sensorData) => {
    if (sensorData === undefined) {
      return resultError()
    }

    return resultOk(sensorData)
  },
)
