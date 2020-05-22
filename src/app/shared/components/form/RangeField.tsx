import { css } from 'emotion'
import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useState } from 'react'
import { typedStyles } from '../../../theme/styleHelpers'

type Props = {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  debounceChange?: boolean
  onChange: (value: number) => void
}

const RangeField: React.FC<Props> = (props) => {
  const { label, value, min, max, step, onChange, debounceChange } = props

  const [localValue, setLocalValue] = useState<number>(value)

  const onChangeDebounced = useCallback(
    debounce((updatedValue: number) => {
      onChange(updatedValue)
    }, 300),
    [],
  )

  useEffect(() => {
    if (debounceChange === true) {
      setLocalValue(value)
    }
  }, [value, min, max, debounceChange])

  useEffect(() => {
    if (debounceChange) {
      onChangeDebounced(localValue)
    }
  }, [localValue, debounceChange, onChangeDebounced])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.valueAsNumber

    if (debounceChange !== true) {
      onChange(value)
    } else {
      setLocalValue(value)
    }
  }

  const correctValue = debounceChange ? localValue : value

  return (
    <label className={css(styles.wrapper)}>
      <span className={css(styles.label)}>{label}</span>
      <input
        className={css(styles.input)}
        type="range"
        value={correctValue}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
      />
    </label>
  )
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
    width: '100%',
  },
})

export default RangeField
