import { css } from 'emotion'
import React from 'react'
import { typedStyles } from '../../../theme/styleHelpers'

type Props = {}

const HorizontalSpacerSmall: React.FC<Props> = (props) => {
  return <div className={css(styles.wrapper)} />
}

const styles = typedStyles({
  wrapper: {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
})

export default HorizontalSpacerSmall
