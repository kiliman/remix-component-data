import { DataFunctionArgs } from '@remix-run/server-runtime'

export async function callComponentLoaders(
  args: DataFunctionArgs,
  loaders: any,
) {
  const responses = await Promise.all(
    Object.entries(loaders).map(async ([key, loader]) =>
      callLoader(loader, args, key),
    ),
  )
  const data = {} as any

  const results = await Promise.all(
    responses.map(async (response: any) => await getResponseData(response)),
  )

  Object.keys(loaders).forEach((key, index) => {
    data[key] = results[index]
  })
  return data
}

type ComponentFunctionArgs = DataFunctionArgs & {
  componentParams?: any
}

async function callLoader(
  loader: any,
  args: ComponentFunctionArgs,
  key: string,
) {
  try {
    if (key) {
      args.componentParams = getComponentParams(key)
    }
    return await loader(args)
  } catch (e) {
    return e
  }
}

async function callAction(
  action: any,
  args: ComponentFunctionArgs,
  key: string,
) {
  try {
    if (key) {
      args.componentParams = getComponentParams(key)
    }
    return await action(args)
  } catch (e) {
    return e
  }
}

function getComponentParams(key: string) {
  const index = key.indexOf('?')
  if (index < 0) return {}
  return Object.fromEntries(new URLSearchParams(key.substring(index)))
}

export async function callComponentActions(
  args: DataFunctionArgs,
  actions: any,
) {
  const { request } = args
  const formData = await request.formData()
  // find component action that match the posted form data
  if (formData.has('$$actionComponentId')) {
    const componentId = formData.get('$$actionComponentId') as string
    let action = actions[componentId]
    // match component id to action (which can include :params)
    // HACK: need to find a better way to do this
    if (componentId.includes('?')) {
      action = actions[componentId.substring(0, componentId.indexOf('='))]
    }
    const response = await await callAction(action, args, componentId)
    return { handled: true, response }
  }
  return { handled: false, response: null }
}

async function getResponseData(response: any) {
  if (response instanceof Error) {
    return {
      $$error: { message: response.message, stack: response.stack },
    }
  }
  if (response instanceof Response) {
    if (response.status >= 400) {
      return {
        $$caught: {
          status: response.status,
          statusText: response.statusText,
        },
      }
    }
    try {
      const json = await response.json()
      return { json }
    } catch (e) {
      return {
        //@ts-ignore
        $$error: { message: e.message, stack: e.stack },
      }
    }
  }
}
