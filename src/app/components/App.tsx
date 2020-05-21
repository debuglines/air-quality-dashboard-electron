import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import ChartScreen from '../../graph/components/ChartScreen'
import DashboardScreen from '../../sensor/components/DashboardScreen'
import SynchronizeScreen from '../../synchronize/components/SynchronizeScreen'
import {
  dashboardRoute,
  graphPathIndex,
  syncPath,
} from '../helpers/routesHelper'
import ContentWrapper from '../shared/components/layout/ContentWrapper'
import '../theme/a-reset.css'
import '../theme/global.css'
import AppHeader from './AppHeader'

type Props = {}

const App: React.FC<Props> = (props) => {
  return (
    <HashRouter>
      <div>
        <AppHeader />

        <ContentWrapper>
          <Switch>
            <Route path={graphPathIndex()}>
              <ChartScreen />
            </Route>
            <Route path={syncPath()}>
              <SynchronizeScreen />
            </Route>
            <Route path={dashboardRoute()}>
              <DashboardScreen />
            </Route>
          </Switch>
        </ContentWrapper>
      </div>
    </HashRouter>
  )
}

export default App
