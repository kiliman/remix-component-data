import { LoaderFunction } from '@remix-run/react'
import { useComponentData } from '../../utils/useComponentData'

export const loader: LoaderFunction = async () => {
  return { time: Date.now() }
}

export default function ServerTime() {
  const [{ time }, setData, getData] = useComponentData('ServerTime')
  const handleRefresh = async () => {
    const { time: newTime } = await getData()
    setData({ time: newTime })
  }
  return (
    <>
      <div>Server time is now {time}</div>
      <button onClick={handleRefresh}>Refresh</button>
    </>
  )
}
