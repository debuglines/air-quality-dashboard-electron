import { css } from 'emotion'
import React from 'react'
import { typedStyles } from '../../../theme/styleHelpers'

type Props = {}

const ContentWrapper: React.FC<Props> = (props) => {
  return <div className={css(styles.wrapper)}>{props.children}</div>
}

const styles = typedStyles({
  wrapper: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
})

export default ContentWrapper
