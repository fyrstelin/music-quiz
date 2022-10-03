import { createContext, FC, ReactElement, useContext, useEffect, useState } from "react";

type Api = {
  available: true
} | {
  available: false
}

const Context = createContext<Api>({
  available: false
})

export const DeezerApi: FC<{
  children: ReactElement
}> = ({ children }) => {
  const [available, setAvailable] = useState(false)

  const value = {
    available
  }

  useEffect(() => {
    fetch('/api/options', { method: 'HEAD' })
      .then(r => {
        setAvailable(!!r.headers.get('Content-Type')?.startsWith('application/json'))
      })
  }, [])

  return <Context.Provider value={value}>
    {children}
  </Context.Provider>
}

export const useDeezerApi = () => useContext(Context)
