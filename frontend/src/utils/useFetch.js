import { useState, useEffect, useRef } from 'react'

// Here we have a reusable hook to perform the fetching of data.
export default function useFetch(url, init) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const previousUrl = useRef()
  const previousInit = useRef()
  

  // We call fetch when the parameters change.
  useEffect(() => {
    //if (previousUrl.current === url && previousInit.current === init) { return }

    previousUrl.current = url
    previousInit.current = init
    setLoading(true)

    fetch(url, init)
      .then(res => res.status === 200 ? res.json() : setError(res))
      .then(data => setData(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [url, init])

  return { data, loading, error }
}
