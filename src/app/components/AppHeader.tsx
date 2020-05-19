import React from 'react'
import { typedStyles } from '../theme/styleHelpers'
import { css } from 'emotion'
import { Link } from 'react-router-dom'
import { dashboardRoute, rootRoute, syncPath } from '../routesHelper'

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
  return (
    <li className={css(styles.menuItemWrapper)}>
      <Link className={css(styles.menuItem)} to={props.path}>
        {props.label}
      </Link>
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
})

export default AppHeader
