import { createContext, useContext } from 'react'

type ComponentContextType = {
  id?: string
  loaderData?: any
  actionData?: any
}

const context = createContext({ id: '', loaderData: null, actionData: null })

export function useComponentData<LoaderType>(): LoaderType | null {
  const { id, loaderData } = useContext(context)
  return loaderData?.['json'] as any
}

export function useComponentId(): string {
  const { id } = useContext(context)
  return id
}

export function useComponentParams(): any {
  const { id } = useContext(context)
  return new URLSearchParams(id)
}

export function useComponentActionData() {
  const { actionData } = useContext(context)
  return actionData!
}

export function useComponentCatch() {
  const { loaderData } = useContext(context)
  return loaderData?.['$$caught'] as any
}

function ComponentData({ id, loaderData, actionData, children }: any) {
  let Component = children

  if (loaderData?.$$caught || actionData?.$$caught) {
    Component = Component.type.CatchBoundary
    return (
      <context.Provider value={{ id, loaderData, actionData }}>
        <Component />
      </context.Provider>
    )
  } else if (loaderData?.$$error || actionData?.$$error) {
    Component = Component.type.ErrorBoundary
    return <Component error={loaderData.$$error ?? actionData?.$$error} />
  }

  return (
    <context.Provider value={{ id, loaderData, actionData }}>
      {Component}
    </context.Provider>
  )
}

ComponentData.Params = function ({ params }: any) {
  const { id } = useContext(context) as ComponentContextType
  if (!id) {
    throw new Error('You must provide an id in <ComponentData/>')
  }
  return <input type="hidden" name="$$actionComponentId" value={id} />
}

export default ComponentData
