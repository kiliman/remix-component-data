export function useComponentParams(req: any): any {
  const url = new URL(req.url)
  return [...url.searchParams.entries()].reduce(
    (acc, [key, val]) => ({
      ...acc,
      // eslint-disable-next-line no-nested-ternary
      [key]: Object.prototype.hasOwnProperty.call(acc, key)
        ? Array.isArray(acc[key])
          ? [...acc[key], val]
          : [acc[key], val]
        : val,
    }),
    {},
  )
}
