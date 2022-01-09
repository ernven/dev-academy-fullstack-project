import { useState, useEffect } from 'react'

import DataTable from './components/DataTable'

function App() {
  const [farms, setFarms] = useState([])
  const [data, setData] = useState([])

  useEffect(() => 
    Promise.all([
      fetch('/farms')
        .then(res => res.status === 200 ? res.json() : console.log(res)),
      fetch('/data')
        .then(res => res.status === 200 ? res.json() : console.log(res))
    ])
      .then(([farms, farmData]) => {
        if (farms) { setFarms(farms) }
        if (farmData) { setData(farmData) }
      })
      .catch(err => console.log(err))
  , [])

  return (
    <div>
      <DataTable farms={farms} data={data} />
    </div>
  )
}

export default App
