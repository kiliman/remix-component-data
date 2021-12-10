# Remix Component Data

<img src="./images/screenshot.png" alt="Screenshot of Component Data with error handling"/>

This is a proof of concept for showing how you can expose `loader` functions
from your components to use in your routes.

Once the API has settled down, I'll create a NPM package.

View example site at https://remix-component-data.herokuapp.com/

## 🛠 Usage

Your route module still controls the current page's loader. To add component
loaders, you will need to import them manually into your route.

```ts
// route.tsx
import Widget1, { loader as widget1loader } from '~/components/widget1'
import Widget2, { loader as widget2loader } from '~/components/widget2'

// widget1.tsx
export let loader: LoaderFunction = async () => {
  return json({ message: 'Hello from Widget 1' })
}
```

You then need to call these component loaders and return the data with your
existing route loader.

```ts
// route.tsx
import { callComponentLoaders } from '~/utils/remix-component-data'

export let loader: LoaderFunction = async () => {
  // your route's data
  let routeData = { ... }
  // call all component loaders
  const componentData = await callComponentLoaders({
    widget1: widget1Loader,
    widget2: widget2Loader,
  })
  return json({ routeData, componentData })
}
```

You can now access the component data in your default route export. Wrap your
component inside `<ComponentData>` and pass the specific component's data with
the `data` prop.

```ts
// route.tsx
import ComponentData from '~/components/ComponentData'

export default function Index() {
  let { routeData, componentData } = useLoaderData()
  return (
    <div className="widgetContainer">
      {/* Wrap widget in <ComopnentData> and pass in widget loader data */}
      <ComponentData data={componentData.widget1}>
        <Widget1 />
      </ComponentData>
      <ComponentData data={componentData.widget2}>
        <Widget2 />
      </ComponentData>
    </div>
  )
}
```

## 💣 Handling errors

You component can also have a custom `CatchBoundary` and `ErrorBoundary`. Simply
add it as a property to your default export. Just like a route, you can access the
data using the `useComponentCatch` hook and the `error` prop.

```ts
// widget1.tsx
function Widget1() {}
export default Widget1

Widget1.CatchBoundary = function () {
  const caught = useComponentCatch()
  ...
}
Widget1.ErrorBoundary = function({error}) {
  return <div>{error.message}</div>
}
```

## 🙏 Feedback welcome

Please provide feedback either via Issues or on the Remix Discord. Thanks for
taking a look.
