import { css } from 'emotion'
import React from 'react'
import { typedStyles } from '../../../theme/styleHelpers'

type ValueType = string | string[] | number | undefined

type Props = {
  label: string
  value: ValueType
  type: 'text' | 'password' | 'number'
  onValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const InputField: React.FC<Props> = (props) => {
  const { label, type, value, onValueChange } = props

  return (
    <label className={css(styles.wrapper)}>
      <span className={css(styles.labelText)}>{label}</span>
      <input
        className={css(styles.input)}
        type={type}
        value={value}
        onChange={onValueChange}
      />
    </label>
  )
}

const styles = typedStyles({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  labelText: {
    padding: '10px',
    paddingLeft: 0,
  },
  input: {
    padding: '10px',
  },
})

export default InputField
