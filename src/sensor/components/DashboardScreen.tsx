import { useStore } from 'effector-react'
import React, { useEffect } from 'react'
import VerticalSpacerSmall from '../../app/shared/components/spacers/VerticalSpacerSmall'
import PageHeading from '../../app/shared/components/typography/PageHeading'
import AirQualityStore, { loadLatestSensorData } from '../../app/store/store'
import SensorDataOverviewWidget from './SensorDataOverviewWidget'

type Props = {}

const DashboardScreen: React.FC<Props> = (props) => {
  const store = useStore(AirQualityStore)
  const latestSensorDataResult = store.latestSensorData

  useEffect(() => {
    loadLatestSensorData(undefined)
  }, [])

  const pageHeader = (
    <>
      <PageHeading>Dashboard</PageHeading>
      <VerticalSpacerSmall />
    </>
  )

  if (latestSensorDataResult === undefined) {
    return (
      <div>
        {pageHeader}
        <p>Loading sensor data from disk</p>
      </div>
    )
  }

  if (latestSensorDataResult.error === true) {
    return (
      <div>
        {pageHeader}
        <p>There was an error laoding the latest sensor data. </p>
      </div>
    )
  }

  const latestSensorData = latestSensorDataResult.ok

  return (
    <div>
      {pageHeader}
      <SensorDataOverviewWidget sensorData={latestSensorData} />
    </div>
  )
}

export default DashboardScreen
