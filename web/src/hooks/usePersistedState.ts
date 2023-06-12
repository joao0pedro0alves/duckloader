import { Dispatch, SetStateAction, useState, useEffect } from 'react'

export function usePersistedState<T = unknown>(
  key: string,
  fallbackInitialState: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const storagedState = localStorage.getItem(key)

    if (storagedState) {
      return JSON.parse(storagedState)
    } else {
      return fallbackInitialState
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}
