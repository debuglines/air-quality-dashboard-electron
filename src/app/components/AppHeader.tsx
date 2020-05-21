import { css } from 'emotion'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { dashboardRoute, rootRoute, syncPath } from '../helpers/routesHelper'
import { typedStyles } from '../theme/styleHelpers'

type Props = {}

const AppHeader: React.FC<Props> = (props) => {
  return (
    <header className={css(styles.wrapper)}>
      <h1>
        <Link className={css(styles.menuItem)} to={rootRoute()}>
          Air quality dashboard
        </Link>
      </h1>

      <ul className={css(styles.menuItems)}>
        <MenuItem label="Dashboard" path={dashboardRoute()} />
        <MenuItem label="Manage sync" path={syncPath()} />
      </ul>
    </header>
  )
}

type MenuItemProps = {
  path: string
  label: string
}

const MenuItem: React.FC<MenuItemProps> = (props) => {
  const useExact = props.path === rootRoute()
  return (
    <li className={css(styles.menuItemWrapper)}>
      <NavLink
        className={css(styles.menuItem)}
        to={props.path}
        activeClassName={css(styles.menuItemActive)}
        exact={useExact}
      >
        {props.label}
      </NavLink>
    </li>
  )
}

const styles = typedStyles({
  wrapper: {
    height: '60px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
  },
  menuItems: {
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  menuItemWrapper: {
    height: '100%',
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textDecoration: 'none',
    height: '100%',
    letterSpacing: 1.1,
    fontSize: '20px',
    paddingLeft: '20px',
    paddingRight: '20px',
    verticalAlign: 'middle',
  },
  menuItemActive: {
    boxShadow: 'inset 0px -2px 0px 0px #000',
  },
})

export default AppHeader
