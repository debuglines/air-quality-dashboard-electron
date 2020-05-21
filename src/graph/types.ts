import { SensorQuality } from '../sensor/domain/sensorData'

export enum GraphType {
  Radon = 'radon',
  Voc = 'voc',
  Co2 = 'co2',
  Humidity = 'humidity',
  Temperature = 'temperature',
  Pressure = 'pressure',
}

export type LineChartPoint = {
  date: string
  value: number
}

export type ReferenceAreaValues = { sensorQuality: SensorQuality } & (
  | {
      valueLow: number
      valueHigh: number
    }
  | {
      valueLow: undefined
      valueHigh: number
    }
  | {
      valueLow: number
      valueHigh: undefined
    }
)
