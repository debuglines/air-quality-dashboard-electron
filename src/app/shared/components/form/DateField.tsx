import { css } from 'emotion'
import React from 'react'
import { typedStyles } from '../../../theme/styleHelpers'

type Props = {
  value: Date
  min?: Date
  max?: Date
  label: string
  onChange: (date: Date) => void
}

const DateField: React.FC<Props> = (props) => {
  const { label, value, onChange, min, max } = props

  const valueString = stringifyDate(value)
  const minValue = stringifyDate(min)
  const maxValue = stringifyDate(max)

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.valueAsDate
    if (value === null) {
      return
    }
    onChange(value)
  }

  return (
    <label className={css(styles.wrapper)}>
      <span className={css(styles.label)}>{label}</span>
      <input
        className={css(styles.input)}
        type="date"
        value={valueString}
        min={minValue}
        max={maxValue}
        onChange={handleDateChange}
      />
    </label>
  )
}

function stringifyDate(date?: Date): string | undefined {
  return date?.toISOString().split('T')[0]
}

const styles = typedStyles({
  wrapper: {
    display: 'block',
  },
  label: {
    display: 'block',
  },
  input: {
    display: 'block',
  },
})

export default DateField
