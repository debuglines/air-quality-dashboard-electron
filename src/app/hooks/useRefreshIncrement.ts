import useInterval from './useInterval'
import { useState } from 'react'

function useRefreshIncrement(refreshInMs: number) {
  const [refreshIncrement, setRefreshIncrement] = useState<number>(0)

  useInterval(() => {
    setRefreshIncrement(refreshIncrement + 1)
  }, refreshInMs)

  return refreshIncrement
}

export default useRefreshIncrement
