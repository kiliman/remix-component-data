//@ts-nocheck
import { json, LoaderFunction } from 'remix'
import { useComponentData, useComponentCatch } from './ComponentData'
import { getSession } from '~/sessions'

type LoaderData = {
  message: string
}
export let loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))
  const likeCount = Object.keys(session.data).filter(key =>
    key.startsWith('liked-'),
  ).length

  return json({ message: 'Hello from Widget 1', likeCount })
}

function Widget1() {
  const data = useComponentData()
  return (
    <div className="widget">
      <h1>Widget</h1>
      <p>{data.message}</p>
      <p> Total Like Counts: {data.likeCount}</p>
    </div>
  )
}

// add custom CatchBoundary and ErrorBoundary to the default export
Widget1.CatchBoundary = function () {
  const caught = useComponentCatch()
  return (
    <div className="widget">
      <h1>Catch Boundary</h1>
      <pre>{JSON.stringify(caught, null, 2)}</pre>
    </div>
  )
}
Widget1.ErrorBoundary = function ({ error }: any) {
  return (
    <div className="widget">
      <h1>Error Boundary</h1>
      <h2>{error.message}</h2>
      <pre>{error.stack}</pre>
    </div>
  )
}
export default Widget1
