import { Result } from '../types'
import { resultError, resultOk } from './helpers'

export function trying<T>(callback: () => T): Result<T> {
  try {
    return resultOk(callback())
  } catch (err) {
    return resultError()
  }
}
