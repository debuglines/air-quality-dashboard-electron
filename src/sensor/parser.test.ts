// import expect from 'expect'
import { parseSensorDataCsvLine } from './parser'
import parseISO from 'date-fns/parseISO'

describe('parser', () => {
  it('parse sensor data csv line', () => {
    const inputLine =
      '2020-05-01 13:37:28.726093494 UTC,19.33,36,990.7,739,152,5,6,'
    const sensorData = parseSensorDataCsvLine(inputLine)
    expect(sensorData).toBeDefined()

    if (sensorData === undefined) {
      throw new Error('expect sensor data to be defined')
    }

    expect(sensorData.datetimeUtc.toISOString()).toBe(
      parseISO('2020-05-01 13:37:28.726093494 UTC').toISOString(),
    )
    expect(sensorData.temperatureInCelcius).toBe(19.33)
    expect(sensorData.humidity).toBe(36)
    expect(sensorData.pressure).toBe(990.7)
    expect(sensorData.co2).toBe(739)
    expect(sensorData.voc).toBe(152)
    expect(sensorData.radonShortTermAverage).toBe(5)
    expect(sensorData.radonLongTermAverage).toBe(6)
  })
})
