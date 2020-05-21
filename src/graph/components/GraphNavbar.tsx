import { css } from 'emotion'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { chartPath } from '../../app/helpers/routesHelper'
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
          to={chartPath(GraphType.Radon)}
        >
          Radon
        </NavLink>
      </li>
      <li>
        <NavLink
          className={css(styles.link)}
          activeClassName={css(styles.linkActive)}
          to={chartPath(GraphType.Voc)}
        >
          VOC
        </NavLink>
      </li>
      <li>
        <NavLink
          className={css(styles.link)}
          activeClassName={css(styles.linkActive)}
          to={chartPath(GraphType.Co2)}
        >
          CO2
        </NavLink>
      </li>
      <li>
        <NavLink
          className={css(styles.link)}
          activeClassName={css(styles.linkActive)}
          to={chartPath(GraphType.Humidity)}
        >
          Humidity
        </NavLink>
      </li>
      <li>
        <NavLink
          className={css(styles.link)}
          activeClassName={css(styles.linkActive)}
          to={chartPath(GraphType.Temperature)}
        >
          Temperature
        </NavLink>
      </li>
      <li>
        <NavLink
          className={css(styles.link)}
          activeClassName={css(styles.linkActive)}
          to={chartPath(GraphType.Pressure)}
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
