export async function callComponentLoaders(loaders: any) {
  const responses = await Promise.all(
    Object.values(loaders).map(async (loader: any) => callLoader(loader)),
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

async function callLoader(loader: any) {
  try {
    return await loader()
  } catch (e) {
    return e
  }
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
