export type ResultOk<T> = {
  ok: T
  error: undefined
}

export type ResultError = {
  ok: undefined
  error: true
}

export type Result<T> = ResultOk<T> | ResultError

export const TIMEZONE_STRING = 'Europe/Oslo'
