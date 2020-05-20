import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import GraphScreen from '../../graph/components/GraphScreen'
import DashboardScreen from '../../sensor/components/DashboardScreen'
import SynchronizeScreen from '../../synchronize/components/SynchronizeScreen'
import { dashboardRoute, graphPathIndex, syncPath } from '../routesHelper'
import '../theme/a-reset.css'
import '../theme/global.css'
import AppHeader from './AppHeader'

type Props = {}

const App: React.FC<Props> = (props) => {
  return (
    <HashRouter>
      <div>
        <AppHeader />

        <Switch>
          <Route path={graphPathIndex()}>
            <GraphScreen />
          </Route>
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
