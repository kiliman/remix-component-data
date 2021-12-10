//@ts-nocheck
import type { MetaFunction, LoaderFunction } from 'remix'
import { useLoaderData, json, Link } from 'remix'
import ComponentData from '~/components/ComponentData'
import { callComponentLoaders } from '~/utils/remix-component-data'

// import widgets and loaders
import Widget1, { loader as widget1Loader } from '~/components/widget1'
import Widget2, { loader as widget2Loader } from '~/components/widget2'
import Widget3, { loader as widget3Loader } from '~/components/widget3'

type IndexData = {
  resources: Array<{ name: string; url: string }>
  demos: Array<{ name: string; to: string }>
}

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = async () => {
  let routeData: IndexData = {
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
  // call all component loaders
  const componentData = await callComponentLoaders({
    widget1: widget1Loader,
    widget2: widget2Loader,
    widget3: widget3Loader,
  })
  // https://remix.run/api/remix#json
  return json({ routeData, componentData })
}

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter',
    description: 'Welcome to remix!',
  }
}

export default function Index() {
  let { routeData, componentData } = useLoaderData()
  return (
    <div className="remix__page">
      <main>
        <div className="widgetContainer">
          {/* Wrap widget in <ComopnentData> and pass in widget loader data */}
          <ComponentData data={componentData.widget1}>
            <Widget1 />
          </ComponentData>
          <ComponentData data={componentData.widget2}>
            <Widget2 />
          </ComponentData>
          <ComponentData data={componentData.widget3}>
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
