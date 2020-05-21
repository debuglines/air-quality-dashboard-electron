import { css } from 'emotion'
import React from 'react'
import { typedStyles } from '../../../theme/styleHelpers'

type Props = {}

const PageHeading: React.FC<Props> = (props) => {
  return <h1 className={css(styles.wrapper)}>{props.children}</h1>
}

const styles = typedStyles({
  wrapper: {
    fontSize: '24px',
    fontWeight: 'normal',
    lineHeight: '26px',
    letterSpacing: 1.1,
  },
})

export default PageHeading
