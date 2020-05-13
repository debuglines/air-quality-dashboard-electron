import React, { useEffect } from 'react'
import { LatestSensorData, loadLatestSensorData } from '../store'
import { useStore } from 'effector-react'
import SensorDataOverviewWidget from './SensorDataOverviewWidget'

type Props = {}

const DashboardScreen: React.FC<Props> = (props) => {
  const latestSensorDataResult = useStore(LatestSensorData)

  useEffect(() => {
    loadLatestSensorData(undefined)
  }, [])

  if (latestSensorDataResult === null) {
    return (
      <div>
        <p>Loading sensor data from disk</p>
      </div>
    )
  }

  if (latestSensorDataResult.error === true) {
    return (
      <div>
        <p>There was an error laoding the latest sensor data. </p>
      </div>
    )
  }

  const latestSensorData = latestSensorDataResult.ok

  return (
    <div>
      <SensorDataOverviewWidget sensorData={latestSensorData} />
    </div>
  )
}

export default DashboardScreen
