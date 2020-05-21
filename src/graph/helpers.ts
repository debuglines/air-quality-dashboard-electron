import { format, isAfter, isBefore, parseJSON } from 'date-fns'
import { LineChartPoint } from './types'

export function graphDateFormatter(dateStr: string): string {
  const date = parseJSON(dateStr)
  return format(date, 'yyyy-MM-dd HH:mm')
}

export function getDataPointSlice(
  dataPoints: LineChartPoint[],
  earlyDate: Date,
  lateDate: Date,
) {
  if (isAfter(earlyDate, lateDate)) {
    return []
  }

  return dataPoints.filter((dataPoint) => {
    const date = parseJSON(dataPoint.date)
    const isAfterSelectedDate = isAfter(date, earlyDate)
    const isBeforeSelectedDate = isBefore(date, lateDate)

    return isAfterSelectedDate && isBeforeSelectedDate
  })
}

export function getFirstListItemOrUndefined<T>(list: T[]): T | undefined {
  if (list.length === 0) {
    return undefined
  }

  return list[0]
}

export function getLastListItemOrUndefined<T>(list: T[]): T | undefined {
  if (list.length === 0) {
    return undefined
  }

  return list[Math.max(list.length - 1, 0)]
}
