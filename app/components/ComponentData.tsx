import { createContext, useContext } from 'react'

const context = createContext(null)

export function useComponentData<LoaderType>(): LoaderType | null {
  const data = useContext(context)
  return data!['json'] as any
}

export function useComponentCatch() {
  const data = useContext(context)
  return data!['$$caught'] as any
}

export default function ComponentData({ data, children }: any) {
  let Component = children

  if (data.$$caught) {
    Component = Component.type.CatchBoundary
    return (
      <context.Provider value={data}>
        <Component />
      </context.Provider>
    )
  } else if (data.$$error) {
    Component = Component.type.ErrorBoundary
    return <Component error={data.$$error} />
  }

  return <context.Provider value={data}>{Component}</context.Provider>
}
