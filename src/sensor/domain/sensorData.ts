export type SensorData = {
  datetimeUtc: Date
  temperatureInCelcius: number
  humidity: number
  pressure: number
  radonShortTermAverage: number
  radonLongTermAverage: number
  co2: number
  voc: number
}

export enum SensorQuality {
  Good = 'GOOD',
  Bad = 'BAD',
  Terrible = 'TERRIBLE',
  DependsOnContext = 'DEPENDS_ON_CONTEXT',
}

export function temperatureQuality(sensorData: SensorData): SensorQuality {
  const value = sensorData.temperatureInCelcius

  if (value >= 26) {
    return SensorQuality.Terrible
  } else if (value >= 18 && value < 26) {
    return SensorQuality.Good
  } else if (value < 18) {
    return SensorQuality.DependsOnContext
  }

  throw new Error('logic error')
}

export function humidityQuality(sensorData: SensorData): SensorQuality {
  const value = sensorData.humidity

  if (value >= 70) {
    return SensorQuality.Terrible
  } else if (value >= 60 && value < 70) {
    return SensorQuality.Bad
  } else if (value >= 30 && value < 60) {
    return SensorQuality.Good
  } else if (value >= 25 && value < 30) {
    return SensorQuality.Bad
  } else if (value < 25) {
    return SensorQuality.Terrible
  }

  throw new Error('logic error')
}

export function vocQuality(sensorData: SensorData): SensorQuality {
  const value = sensorData.voc

  if (value >= 2000) {
    return SensorQuality.Terrible
  } else if (value >= 250 && value < 2000) {
    return SensorQuality.Bad
  } else if (value < 250) {
    return SensorQuality.Good
  }

  throw new Error('logic error')
}

export function co2Quality(sensorData: SensorData): SensorQuality {
  const value = sensorData.co2

  if (value >= 1000) {
    return SensorQuality.Terrible
  } else if (value >= 800 && value < 1000) {
    return SensorQuality.Bad
  } else if (value < 800) {
    return SensorQuality.Good
  }

  throw new Error('logic error')
}

export function radonShortTermQuality(sensorData: SensorData): SensorQuality {
  const value = sensorData.radonShortTermAverage

  if (value >= 150) {
    return SensorQuality.Terrible
  } else if (value >= 100 && value < 150) {
    return SensorQuality.Bad
  } else if (value < 100) {
    return SensorQuality.Good
  }

  throw new Error('logic error')
}

export function radonLongTermQuality(sensorData: SensorData): SensorQuality {
  const value = sensorData.radonShortTermAverage

  if (value >= 150) {
    return SensorQuality.Terrible
  } else if (value >= 100 && value < 150) {
    return SensorQuality.Bad
  } else if (value < 100) {
    return SensorQuality.Good
  }

  throw new Error('logic error')
}

export function pressureQuality(sensorData: SensorData): SensorQuality {
  return SensorQuality.DependsOnContext
}

export function overallQuality(sensorData: SensorData): SensorQuality {
  const overallQuality = [
    temperatureQuality(sensorData),
    humidityQuality(sensorData),
    radonShortTermQuality(sensorData),
    co2Quality(sensorData),
    vocQuality(sensorData),
    pressureQuality(sensorData),
  ]
    .sort()
    .pop()

  if (overallQuality === undefined) {
    throw new Error('Pop type issue')
  }

  return overallQuality
}

export const SENSOR_QUALITY_COLORS = {
  [SensorQuality.Terrible]: '#fad1d0',
  [SensorQuality.Bad]: '#f8d568',
  [SensorQuality.Good]: '#90EE90',
  [SensorQuality.DependsOnContext]: '#add8e6',
}
