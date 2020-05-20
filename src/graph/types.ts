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
