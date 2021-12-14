//@ts-nocheck
import { MetaFunction, LoaderFunction, useActionData } from 'remix'
import { useLoaderData, json, Link } from 'remix'
import ComponentData from '~/components/ComponentData'
import {
  callComponentActions,
  callComponentLoaders,
} from '~/utils/remix-component-data'
// import widgets and loaders
import Widget1, { loader as widget1Loader } from '~/components/widget1'
import Widget2, { loader as widget2Loader } from '~/components/widget2'
import Widget3, { loader as widget3Loader } from '~/components/widget3'
import Widget4, {
  loader as widget4Loader,
  action as widget4Action,
} from '~/components/widget4'

type IndexData = {
  resources: Array<{ name: string; url: string }>
  demos: Array<{ name: string; to: string }>
}

export let loader: LoaderFunction = async args => {
  let routeData = getRouteData()
  // call all component loaders
  const postIds = [1, 2, 3]
  componentLoaders = {
    widget1: widget1Loader,
    widget2: widget2Loader,
    widget3: widget3Loader,
    // dynamic components (same loader, unique key: post?postId=id)
    ...Object.fromEntries(
      postIds.map(id => [`post?postId=${id}`, widget4Loader]),
    ),
  }
  const componentData = await callComponentLoaders(args, componentLoaders)
  routeData.postIds = postIds
  return json({ routeData, componentData })
}

export let action: ActionFunction = async args => {
  // call the component actions
  const componentResponse = await callComponentActions(args, {
    ['post?postId']: widget4Action,
  })
  // check to see if the action was handled
  if (componentResponse.handled) {
    return componentResponse.response
  }
  // if not, process as route action
  return null
}
export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter',
    description: 'Welcome to remix!',
  }
}

export default function Index() {
  let { routeData, componentData } = useLoaderData()
  let actionData = useActionData()

  return (
    <div className="remix__page">
      <main>
        <div className="widgetContainer">
          {/* Wrap widget in <ComopnentData> and pass in widget loader data */}
          <ComponentData loaderData={componentData.widget1}>
            <Widget1 />
          </ComponentData>
          <ComponentData loaderData={componentData.widget2}>
            <Widget2 />
          </ComponentData>
          {routeData.postIds
            .map(postId => `post?postId=${postId}`)
            .map(postId => (
              <ComponentData
                id={postId}
                key={postId}
                loaderData={componentData[postId]}
                actionData={actionData?.[postId]}
              >
                <Widget4 />
              </ComponentData>
            ))}
          <ComponentData loaderData={componentData.widget3}>
            <Widget3 />
          </ComponentData>
        </div>
      </main>
      <aside>
        <h2>Demos In This App</h2>
        <ul>
          {routeData.demos.map(demo => (
            <li key={demo.to} className="remix__page__resource">
              <Link to={demo.to} prefetch="intent">
                {demo.name}
              </Link>
            </li>
          ))}
        </ul>
        <h2>Resources</h2>
        <ul>
          {routeData.resources.map(resource => (
            <li key={resource.url} className="remix__page__resource">
              <a href={resource.url}>{resource.name}</a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}

function getRouteData() {
  return {
    resources: [
      {
        name: 'Remix Docs',
        url: 'https://remix.run/docs',
      },
      {
        name: 'React Router Docs',
        url: 'https://reactrouter.com/docs',
      },
      {
        name: 'Remix Discord',
        url: 'https://discord.gg/VBePs6d',
      },
    ],
    demos: [
      {
        to: 'demos/actions',
        name: 'Actions',
      },
      {
        to: 'demos/about',
        name: 'Nested Routes, CSS loading/unloading',
      },
      {
        to: 'demos/params',
        name: 'URL Params and Error Boundaries',
      },
    ],
  }
}
