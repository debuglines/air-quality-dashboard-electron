import { useEffect, useState } from 'react'
import { SensorData } from '../domain/sensorData'
import {
  LOCAL_BASE_DATA_DIR_PATH_FULL,
  parseLatestSensorDataFromDir,
} from '../parser'

function useLatestSensorData(): SensorData | undefined {
  const [sensorData, setSensorData] = useState<SensorData | undefined>(
    undefined,
  )

  useEffect(() => {
    const run = async () => {
      const sensorData = await parseLatestSensorDataFromDir(
        LOCAL_BASE_DATA_DIR_PATH_FULL,
      )
      setSensorData(sensorData)
    }

    run()
  }, [])

  return sensorData
}

export default useLatestSensorData
