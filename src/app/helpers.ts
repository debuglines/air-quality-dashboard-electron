import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import { ResultError, ResultOk, TIMEZONE_STRING } from './types'

export function resultOk<T>(data: T): ResultOk<T> {
  return {
    ok: data,
    error: undefined,
  }
}

export function resultError(): ResultError {
  return {
    error: true,
    ok: undefined,
  }
}

export function dateWithTimezone(date: Date): Date {
  return utcToZonedTime(date, TIMEZONE_STRING)
}

export function dateFromTimezone(date: Date): Date {
  return zonedTimeToUtc(date, TIMEZONE_STRING)
}
