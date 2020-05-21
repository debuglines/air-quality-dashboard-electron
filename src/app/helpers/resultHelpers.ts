import { Result } from '../types'

export function resultOrUndefined<T>(result: Result<T>): T | undefined {
  if (result.error) {
    return undefined
  } else {
    return result.ok
  }
}
