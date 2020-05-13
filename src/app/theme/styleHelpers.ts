import { Interpolation } from 'emotion'

export function typedStyles<T>(styles: { [key in keyof T]: Interpolation }) {
  return styles
}
