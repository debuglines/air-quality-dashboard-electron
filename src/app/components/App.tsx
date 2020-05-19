import React from 'react'
import DashboardScreen from '../../sensor/components/DashboardScreen'
import '../theme/reset.css'
import '../theme/global.css'
import { HashRouter, Switch, Route } from 'react-router-dom'
import AppHeader from './AppHeader'
import { dashboardRoute, syncPath } from '../routesHelper'
import SynchronizeScreen from '../../synchronize/components/SynchronizeScreen'

type Props = {}

const App: React.FC<Props> = (props) => {
  return (
    <HashRouter>
      <div>
        <AppHeader />

        <Switch>
          <Route path={syncPath()}>
            <SynchronizeScreen />
          </Route>
          <Route path={dashboardRoute()}>
            <DashboardScreen />
          </Route>
        </Switch>
      </div>
    </HashRouter>
  )
}

export default App
