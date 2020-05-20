import React from 'react'
import { LineChart } from 'recharts'

type Props = {
  vocData: {
    datetime: Date
    data: number
  }[]
}

const GraphVoc: React.FC<Props> = (props) => {
  return (
    <div>
      <LineChart></LineChart>
    </div>
  )
}

export default GraphVoc
