import { css } from 'emotion'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { graphPath } from '../../app/routesHelper'
import { typedStyles } from '../../app/theme/styleHelpers'
import { GraphType } from '../types'

type Props = {}

const GraphNavbar: React.FC<Props> = (props) => {
  return (
    <ul className={css(styles.wrapper)}>
      <li>
        <NavLink
          className={css(styles.link)}
          activeClassName={css(styles.linkActive)}
          to={graphPath(GraphType.Radon)}
        >
          Radon
        </NavLink>
      </li>
      <li>
        <NavLink
          className={css(styles.link)}
          activeClassName={css(styles.linkActive)}
          to={graphPath(GraphType.Voc)}
        >
          VOC
        </NavLink>
      </li>
      <li>
        <NavLink
          className={css(styles.link)}
          activeClassName={css(styles.linkActive)}
          to={graphPath(GraphType.Co2)}
        >
          CO2
        </NavLink>
      </li>
      <li>
        <NavLink
          className={css(styles.link)}
          activeClassName={css(styles.linkActive)}
          to={graphPath(GraphType.Humidity)}
        >
          Humidity
        </NavLink>
      </li>
      <li>
        <NavLink
          className={css(styles.link)}
          activeClassName={css(styles.linkActive)}
          to={graphPath(GraphType.Temperature)}
        >
          Temperature
        </NavLink>
      </li>
      <li>
        <NavLink
          className={css(styles.link)}
          activeClassName={css(styles.linkActive)}
          to={graphPath(GraphType.Pressure)}
        >
          Pressure
        </NavLink>
      </li>
    </ul>
  )
}

const styles = typedStyles({
  wrapper: {
    display: 'flex',
    marginBottom: '20px',
  },
  link: {
    display: 'block',
    padding: '10px',
    textDecoration: 'none',
    transitionProperty: 'box-shadow',
    transitionDuration: '300ms',

    ':hover': {
      boxShadow: 'inset 0px -2px 0px 0px #000',
    },
  },
  linkActive: {
    boxShadow: 'inset 0px -2px 0px 0px #000',
  },
})

export default GraphNavbar
