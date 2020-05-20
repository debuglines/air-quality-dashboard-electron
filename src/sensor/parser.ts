import { parseJSON } from 'date-fns'
import { promises as fs } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import { resultOk } from '../app/helpers'
import { Result } from '../app/types'
import { SensorData } from './domain/sensorData'

export const BASE_DIR_NAME = '.air-quality'
export const LOCAL_BASE_DIR_PATH_FULL = join(homedir(), BASE_DIR_NAME)
export const LOCAL_BASE_DATA_DIR_PATH_FULL = join(
  LOCAL_BASE_DIR_PATH_FULL,
  'data',
)

export async function parseAllSensorDataFromDir(
  dirPath: string,
): Promise<Result<SensorData[]>> {
  const filenames = await fs.readdir(dirPath)

  if (filenames.length === 0) {
    return resultOk([])
  }

  const dataPromises = filenames.map((filename) =>
    parseLatestSensorDataFromFile(join(dirPath, filename)),
  )
  const datalist = await Promise.all(dataPromises)

  // filter not able to detect not undefined
  const filteredDataList = datalist.filter(
    (data) => data !== undefined,
  ) as SensorData[]

  return resultOk(filteredDataList)
}

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
    datetimeUtc: parseJSON(timestampRaw),
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
