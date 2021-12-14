//@ts-nocheck
import { ActionFunction, Form, json, LoaderFunction } from 'remix'
import ComponentData, {
  useComponentData,
  useComponentCatch,
  useComponentActionData,
} from './ComponentData'
import { getSession, commitSession } from '~/sessions'

type LoaderData = {
  message: string
}
export let loader: LoaderFunction = async ({ request, componentParams }) => {
  const session = await getSession(request.headers.get('Cookie'))
  const { postId } = componentParams
  const isLiked = session.has(`liked-${postId}`)
  return json({
    postId,
    isLiked,
  })
}

export let action: ActionFunction = async ({ request, componentParams }) => {
  const session = await getSession(request.headers.get('Cookie'))
  const { postId } = componentParams
  const key = `liked-${postId}`
  const isLiked = session.get(key)
  if (isLiked) {
    session.unset(key)
  } else {
    session.set(key, true)
  }

  const s = await commitSession(session)
  return json(
    { message: `You liked Post ${postId}`, isLiked },
    { headers: { 'Set-Cookie': s } },
  )
}

function Widget4() {
  let { postId, isLiked } = useComponentData()
  const actionData = useComponentActionData()
  if (actionData) {
    isLiked = actionData.isLiked
  }

  return (
    <div className="widget">
      <h1>Post {postId}</h1>
      <div>
        <Form method="post">
          <ComponentData.Params />
          <button type="submit">{isLiked ? 'Unlike' : 'Like'}</button>
        </Form>
      </div>
    </div>
  )
}

// add custom CatchBoundary and ErrorBoundary to the default export
Widget4.CatchBoundary = function () {
  const caught = useComponentCatch()
  return (
    <div className="widget">
      <h1>Catch Boundary</h1>
      <pre>{JSON.stringify(caught, null, 2)}</pre>
    </div>
  )
}
Widget4.ErrorBoundary = function ({ error }: any) {
  return (
    <div className="widget">
      <h1>Error Boundary</h1>
      <h2>{error.message}</h2>
      <pre>{error.stack}</pre>
    </div>
  )
}
export default Widget4
