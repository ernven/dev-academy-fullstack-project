import { useState, useEffect } from 'react'

// Here we have a reusable hook to perform the fetching of data.
export default function useFetch(url, init) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  //const previousUrl = useRef()
  //const previousInit = useRef()

  // We call fetch when the parameters change.
  useEffect(() => {
    //if (previousUrl.current === url && previousInit.current === init) { return }

    if (!url) { return }

    //previousUrl.current = url
    //previousInit.current = init

    setLoading(true)
    setError(null)

    fetch(url, init)
      .then(res => res.ok ? res.json() : res.json().then(r => setError(r.error)))
      .then(data => setData(data))
      .catch(err => setError(err + ''))
      .finally(() => setLoading(false))
  }, [init, url])

  return { data, loading, error }
}
