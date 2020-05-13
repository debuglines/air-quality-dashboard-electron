import { useEffect, useRef } from 'react'

function useInterval(callback: () => void, delayInMs: number) {
  const savedCallback = useRef<typeof callback>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current()
      }
    }
    if (delayInMs !== null) {
      const id = setInterval(tick, delayInMs)
      return () => clearInterval(id)
    }
  }, [delayInMs])
}

export default useInterval
