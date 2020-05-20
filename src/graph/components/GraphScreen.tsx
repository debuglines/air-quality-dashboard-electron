import { useStore } from 'effector-react'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import AirQualityStore, { loadAllSensorData } from '../../app/store/store'
import { SensorData } from '../../sensor/domain/sensorData'
import { graphDateFormatter } from '../helpers'
import { GraphType, LineChartPoint } from '../types'
import GraphNavbar from './GraphNavbar'

type Props = {}

const GraphScreen: React.FC<Props> = (props) => {
  const { graphType } = useParams<{ graphType: GraphType }>()
  const { allSensorDataResult } = useStore(AirQualityStore)

  useEffect(() => {
    loadAllSensorData()
  }, [])

  if (allSensorDataResult === undefined) {
    return (
      <div>
        <p>Loading graph data</p>
      </div>
    )
  }

  if (allSensorDataResult.error) {
    return (
      <div>
        <p>Error with the graph data</p>
      </div>
    )
  }

  const allSensorData = allSensorDataResult.ok

  const groupedDataPoints = chartDataPoints(allSensorData)
  const chartData = groupedDataPoints[graphType]

  return (
    <div>
      <GraphNavbar />
      <div>
        <h2>{chartData.heading}</h2>
        <ResponsiveContainer width="95%" height={500}>
          <LineChart data={chartData.dataPoints}>
            <YAxis dataKey="value" />
            <XAxis dataKey="date" tickFormatter={graphDateFormatter} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

type ChartData = {
  heading: string
  dataPoints: LineChartPoint[]
}
type GroupedDataPoints = Record<GraphType, ChartData>

function chartDataPoints(allSensorData: SensorData[]): GroupedDataPoints {
  const vocData: LineChartPoint[] = allSensorData.map((data) => ({
    date: data.datetimeUtc.toISOString(),
    value: data.voc,
  }))

  const temperatureData: LineChartPoint[] = allSensorData.map((data) => ({
    date: data.datetimeUtc.toISOString(),
    value: data.temperatureInCelcius,
  }))

  const radonData: LineChartPoint[] = allSensorData.map((data) => ({
    date: data.datetimeUtc.toISOString(),
    value: data.radonShortTermAverage,
  }))

  const pressureData: LineChartPoint[] = allSensorData.map((data) => ({
    date: data.datetimeUtc.toISOString(),
    value: data.pressure,
  }))

  const humidityData: LineChartPoint[] = allSensorData.map((data) => ({
    date: data.datetimeUtc.toISOString(),
    value: data.humidity,
  }))

  const co2Data: LineChartPoint[] = allSensorData.map((data) => ({
    date: data.datetimeUtc.toISOString(),
    value: data.co2,
  }))

  return {
    [GraphType.Co2]: {
      heading: 'CO2',
      dataPoints: co2Data,
    },
    [GraphType.Voc]: {
      heading: 'Volatile compounds',
      dataPoints: vocData,
    },
    [GraphType.Radon]: {
      heading: 'Radon short-term average',
      dataPoints: radonData,
    },
    [GraphType.Pressure]: {
      heading: 'Air pressure',
      dataPoints: pressureData,
    },
    [GraphType.Temperature]: {
      heading: 'Temperature in C',
      dataPoints: temperatureData,
    },
    [GraphType.Humidity]: {
      heading: 'Humidity in %',
      dataPoints: humidityData,
    },
  }
}

export default GraphScreen
