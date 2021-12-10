import { LoaderFunction } from 'remix'
import { useComponentData } from './ComponentData'

export let loader: LoaderFunction = async () => {
  throw new Error('Oops! from widget3 loader')
}

function Widget3() {
  const data = useComponentData<any>()
  return (
    <div className="widget">
      <h1>{data.message}</h1>
    </div>
  )
}
Widget3.ErrorBoundary = function ({ error }: any) {
  return (
    <div className="widget">
      <h1>Error Boundary</h1>
      <h2>{error.message}</h2>
      <pre>{error.stack}</pre>
    </div>
  )
}
export default Widget3
