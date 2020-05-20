import { useMemo } from 'react'

type CancelAsyncToken = {
  isCancelAsync: boolean
  cancel(): void
}

export function useCancellationToken(): CancelAsyncToken {
  return useMemo<CancelAsyncToken>(() => {
    const token = {
      isCancelAsync: false,
      cancel: () => {},
    }

    token.cancel = () => (token.isCancelAsync = true)

    return token
  }, [])
}
