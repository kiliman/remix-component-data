import { json, LoaderFunction } from 'remix'
import { useComponentData, useComponentCatch } from './ComponentData'

export let loader: LoaderFunction = async () => {
  throw new Response('Bad Request', { status: 400 })
}

function Widget2() {
  const { message } = useComponentData<any>()
  return (
    <div className="widget">
      <h1>{message}</h1>
    </div>
  )
}

Widget2.CatchBoundary = function () {
  const caught = useComponentCatch()
  return (
    <div className="widget">
      <h1>Catch Boundary</h1>
      <pre>{JSON.stringify(caught, null, 2)}</pre>
    </div>
  )
}
export default Widget2
