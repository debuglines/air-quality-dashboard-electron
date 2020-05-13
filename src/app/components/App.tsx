import React from 'react'
import DashboardScreen from '../../air-quality/components/DashboardScreen'
import '../theme/reset.css'
import '../theme/global.css'

type Props = {}

const App: React.FC<Props> = (props) => {
  return (
    <div>
      <header>
        <h1>Air quality dashboard</h1>
      </header>

      <DashboardScreen />
    </div>
  )
}

export default App
