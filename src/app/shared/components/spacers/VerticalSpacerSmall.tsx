import { css } from 'emotion'
import React from 'react'
import { typedStyles } from '../../../theme/styleHelpers'

type Props = {}

const VerticalSpacerSmall: React.FC<Props> = (props) => {
  return <div className={css(styles.wrapper)} />
}

const styles = typedStyles({
  wrapper: {
    paddingTop: '10px',
    paddingBottom: '10px',
  },
})

export default VerticalSpacerSmall
