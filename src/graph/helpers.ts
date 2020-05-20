import { format, parseJSON } from 'date-fns'

export function graphDateFormatter(dateStr: string): string {
  const date = parseJSON(dateStr)
  return format(date, 'yyyy-MM-dd HH:mm')
}
