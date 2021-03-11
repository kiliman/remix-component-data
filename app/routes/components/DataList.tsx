import { LoaderFunction } from '@remix-run/react'
import { useState } from 'react'
import { useComponentData } from '../../utils/useComponentData'
import { useComponentParams } from '../../utils/useComponentParams'

export const loader: LoaderFunction = async ({ request }) => {
  const params = useComponentParams(request)
  console.log('loader', params)
  const { page = '0' } = params

  const list = []
  for (let i = 0; i < 10; i++) {
    list.push(`Item ${parseInt(page) * 10 + i + 1}`)
  }
  return { list }
}

export default function DataList() {
  const [{ list }, setData, getData] = useComponentData(DataList)
  const [page, setPage] = useState(0)

  const handleRefresh = async () => {
    const newPage = page + 1
    setPage(newPage)
    const { list: newList } = await getData({ page: newPage })

    // append list to current list
    setData({ list: [...list, ...newList] })
  }
  return (
    <div>
      <ul>
        {list.map((item: string) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button onClick={handleRefresh}>Get Next 10...</button>
    </div>
  )
}
