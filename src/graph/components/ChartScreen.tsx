import { isAfter, parseJSON, subDays } from 'date-fns'
import { useStore } from 'effector-react'
import { css } from 'emotion'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import DateField from '../../app/shared/components/form/DateField'
import HorizontalSpacerSmall from '../../app/shared/components/spacers/HorizontalSpacerSmall'
import VerticalSpacerSmall from '../../app/shared/components/spacers/VerticalSpacerSmall'
import PageHeading from '../../app/shared/components/typography/PageHeading'
import AirQualityStore, { loadAllSensorData } from '../../app/store/store'
import commonStyles from '../../app/theme/commonStyles'
import {
  SensorData,
  SensorQuality,
  SENSOR_QUALITY_COLORS,
} from '../../sensor/domain/sensorData'
import {
  getDataPointSlice,
  getFirstListItemOrUndefined,
  getLastListItemOrUndefined,
  graphDateFormatter,
} from '../helpers'
import { GraphType, LineChartPoint, ReferenceAreaValues } from '../types'
import GraphNavbar from './GraphNavbar'

type Props = {}

const ChartScreen: React.FC<Props> = (props) => {
  const { graphType } = useParams<{ graphType: GraphType }>()
  const { allSensorDataResult } = useStore(AirQualityStore)
  const currentDate = new Date()
  const [dateSliceDateEarly, setDataSliceDateEarly] = useState<Date>(
    subDays(currentDate, 2),
  )
  const [dateSliceDateLate, setDataSliceDateLate] = useState<Date>(currentDate)

  const updateDateSliceEarly = (updatedDate: Date) => {
    console.log(updatedDate)
    setDataSliceDateEarly(updatedDate)
  }

  const updateDateSliceLate = (updatedDate: Date) => {
    setDataSliceDateLate(updatedDate)
  }

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

  const dataPointSlice = getDataPointSlice(
    chartData.dataPoints,
    dateSliceDateEarly,
    dateSliceDateLate,
  )

  const dataPointFullEarliest = getFirstListItemOrUndefined(
    chartData.dataPoints,
  )
  const dataPointFullLatest = getLastListItemOrUndefined(chartData.dataPoints)

  const dataPointSliceEarliest = getFirstListItemOrUndefined(dataPointSlice)
  const dataPointSliceLatest = getLastListItemOrUndefined(dataPointSlice)
  const dataPointMaxValue = dataPointSlice.reduce(
    (prev, curr) => Math.max(prev, curr.value),
    0,
  )

  const referenceAreas = chartData.referenceAreas.map((referenceData) => {
    const y1 = Math.max(referenceData.valueLow || 0, 0)
    const y2 = Math.min(
      referenceData.valueHigh || dataPointMaxValue,
      dataPointMaxValue,
    )
    const key = `${y1}_${y2}`
    const color = SENSOR_QUALITY_COLORS[referenceData.sensorQuality]
    return (
      <ReferenceArea
        key={key}
        y1={y1}
        y2={y2}
        x1={dataPointSliceEarliest?.date}
        x2={dataPointSliceLatest?.date}
        stroke={color}
        strokeOpacity={0.8}
        fill={color}
        fillOpacity={0.2}
      />
    )
  })

  return (
    <div>
      <GraphNavbar />
      <div>
        <PageHeading>{chartData.heading}</PageHeading>
        <VerticalSpacerSmall />
        <ResponsiveContainer width="95%" height={500}>
          <LineChart data={dataPointSlice}>
            <YAxis dataKey="value" />
            <XAxis dataKey="date" tickFormatter={graphDateFormatter} />
            <Legend />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
            {referenceAreas}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <fieldset>
        <legend>Date slice range</legend>
        <VerticalSpacerSmall />

        {isAfter(dateSliceDateEarly, dateSliceDateLate) && (
          <>
            <p>⚠ The early date is set after the later date. </p>
            <VerticalSpacerSmall />
          </>
        )}

        <div>
          <input type="range" />
          <input type="range" />
        </div>

        <div className={css(commonStyles.flexRowWrap)}>
          <DateField
            label="Start slice date"
            value={dateSliceDateEarly}
            min={dataPointFullEarliest && parseJSON(dataPointFullEarliest.date)}
            max={dataPointFullLatest && parseJSON(dataPointFullLatest.date)}
            onChange={updateDateSliceEarly}
          />
          <HorizontalSpacerSmall />
          <DateField
            label="End slice date"
            value={dateSliceDateLate}
            min={dataPointFullEarliest && parseJSON(dataPointFullEarliest.date)}
            max={dataPointFullLatest && parseJSON(dataPointFullLatest.date)}
            onChange={updateDateSliceLate}
          />
        </div>
      </fieldset>
    </div>
  )
}

type ChartData = {
  heading: string
  dataPoints: LineChartPoint[]
  referenceAreas: ReferenceAreaValues[]
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
      referenceAreas: [
        {
          sensorQuality: SensorQuality.Good,
          valueLow: undefined,
          valueHigh: 800,
        },
        { sensorQuality: SensorQuality.Bad, valueLow: 800, valueHigh: 1000 },
        {
          sensorQuality: SensorQuality.Terrible,
          valueLow: 1000,
          valueHigh: undefined,
        },
      ],
    },
    [GraphType.Voc]: {
      heading: 'Volatile compounds',
      dataPoints: vocData,
      referenceAreas: [
        {
          sensorQuality: SensorQuality.Good,
          valueLow: undefined,
          valueHigh: 250,
        },
        { sensorQuality: SensorQuality.Bad, valueLow: 250, valueHigh: 2000 },
        {
          sensorQuality: SensorQuality.Terrible,
          valueLow: 2000,
          valueHigh: undefined,
        },
      ],
    },
    [GraphType.Radon]: {
      heading: 'Radon short-term average',
      dataPoints: radonData,
      referenceAreas: [
        {
          sensorQuality: SensorQuality.Good,
          valueLow: undefined,
          valueHigh: 100,
        },
        { sensorQuality: SensorQuality.Bad, valueLow: 100, valueHigh: 150 },
        {
          sensorQuality: SensorQuality.Terrible,
          valueLow: 150,
          valueHigh: undefined,
        },
      ],
    },
    [GraphType.Pressure]: {
      heading: 'Air pressure',
      dataPoints: pressureData,
      referenceAreas: [
        {
          sensorQuality: SensorQuality.DependsOnContext,
          valueLow: 0,
          valueHigh: undefined,
        },
      ],
    },
    [GraphType.Temperature]: {
      heading: 'Temperature in C',
      dataPoints: temperatureData,
      referenceAreas: [
        { sensorQuality: SensorQuality.Good, valueLow: 18, valueHigh: 26 },
        {
          sensorQuality: SensorQuality.Terrible,
          valueLow: 26,
          valueHigh: undefined,
        },
        {
          sensorQuality: SensorQuality.DependsOnContext,
          valueLow: undefined,
          valueHigh: 18,
        },
      ],
    },
    [GraphType.Humidity]: {
      heading: 'Humidity in %',
      dataPoints: humidityData,
      referenceAreas: [
        { sensorQuality: SensorQuality.Good, valueLow: 30, valueHigh: 60 },
        { sensorQuality: SensorQuality.Bad, valueLow: 25, valueHigh: 30 },
        { sensorQuality: SensorQuality.Bad, valueLow: 60, valueHigh: 70 },
        {
          sensorQuality: SensorQuality.Terrible,
          valueLow: 70,
          valueHigh: undefined,
        },
        {
          sensorQuality: SensorQuality.Terrible,
          valueLow: undefined,
          valueHigh: 25,
        },
      ],
    },
  }
}

export default ChartScreen
