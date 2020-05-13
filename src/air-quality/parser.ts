import { SensorData } from './domain/sensorData'
import { parseISO } from 'date-fns'
import { promises as fs } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

export const BASE_DIR_NAME = '.air-quality'
export const BASE_DIR_PATH = join(homedir(), BASE_DIR_NAME)
export const BASE_DATA_DIR_PATH = join(BASE_DIR_PATH, 'data')

export async function parseLatestSensorDataFromDir(
  dirPath: string,
): Promise<SensorData | undefined> {
  const files = await fs.readdir(dirPath)

  const latestFilename = files.sort().pop()

  if (latestFilename === undefined) {
    return undefined
  }

  return parseLatestSensorDataFromFile(join(dirPath, latestFilename))
}

export async function parseLatestSensorDataFromFile(
  filepath: string,
): Promise<SensorData | undefined> {
  const fileData = await fs.readFile(filepath, { encoding: 'utf8' })
  return parseLatestSensorDataFromFileData(fileData)
}

export function parseLatestSensorDataFromFileData(
  fileData: string,
): SensorData | undefined {
  const lines = fileData.split('\n')
  if (lines.length <= 1) {
    return undefined
  }

  let line = lines.pop()
  if (line?.trim() === '') {
    line = lines.pop()
  }

  if (line === undefined) {
    return undefined
  }

  return parseSensorDataCsvLine(line)
}

export function parseSensorDataCsvLine(line: string): SensorData | undefined {
  const [
    timestampRaw,
    temperatureRaw,
    humidityRaw,
    pressureRaw,
    co2Raw,
    vocRaw,
    radonShortTermAverageRaw,
    radonLongTermAverageRaw,
  ] = line.split(',').map((data) => data.trim())

  return {
    datetimeUtc: parseISO(timestampRaw),
    temperatureInCelcius: parseFloat(temperatureRaw),
    humidity: parseFloat(humidityRaw),
    pressure: parseFloat(pressureRaw),
    co2: parseFloat(co2Raw),
    voc: parseFloat(vocRaw),
    radonLongTermAverage: parseFloat(radonLongTermAverageRaw),
    radonShortTermAverage: parseFloat(radonShortTermAverageRaw),
  }
}

export function parseFloat(value: string): number {
  return Number.parseFloat(value)
}
