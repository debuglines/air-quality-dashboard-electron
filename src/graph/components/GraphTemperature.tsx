import React from 'react'
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { graphDateFormatter } from '../helpers'
import { LineChartPoint } from '../types'

type Props = {
  vocData: LineChartPoint[]
}

const GraphTemperature: React.FC<Props> = (props) => {
  return (
    <div>
      <h2>Temperature</h2>
      <ResponsiveContainer width="95%" height={500}>
        <LineChart data={props.vocData}>
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
  )
}

export default GraphTemperature
