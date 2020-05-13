import { ResultOk, ResultError } from './types'

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
