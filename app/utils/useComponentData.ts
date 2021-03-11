import { useRouteData } from '@remix-run/react'
import { useState } from 'react'

export const useComponentData = (componentName: string) => {
  const routeData = useRouteData()
  // component data will be added to route data under $components.[componentName]
  const componentDataFromRoute = routeData?.$components[componentName] ?? {}
  const [data, setData] = useState(componentDataFromRoute)

  // @ts-ignore
  async function getData(params) {
    const componentPath = `/components/${componentName}`
    const url = new URL(componentPath, window.location.origin)
    url.searchParams.set('_data', `routes${componentPath}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) =>
        // @ts-ignore
        url.searchParams.set(key, value),
      )
    }
    url.searchParams.sort() // Improves caching

    const response = await fetch(url.href)
    const json = await response.json()
    return json
  }

  return [data, setData, getData]
}
