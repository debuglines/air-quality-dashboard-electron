import { SensorData } from '../domain/sensorData'
import {
  parseLatestSensorDataFromFile,
  BASE_DIR_PATH,
  BASE_DATA_DIR_PATH,
  parseLatestSensorDataFromDir,
} from '../parser'
import { useState, useEffect } from 'react'

function useLatestSensorData(): SensorData | undefined {
  const [sensorData, setSensorData] = useState<SensorData | undefined>(
    undefined,
  )

  useEffect(() => {
    const run = async () => {
      const sensorData = await parseLatestSensorDataFromDir(BASE_DATA_DIR_PATH)
      setSensorData(sensorData)
    }

    run()
  }, [])

  return sensorData
}

export default useLatestSensorData
