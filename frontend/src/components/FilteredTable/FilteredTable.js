import { useState, useEffect } from 'react'

import useFetch from '../../utils/useFetch'
import DataTable from './Table/DataTable'
import Filters from './Filters'

export default function FilteredTable({ farms }) {
  const [data, setData] = useState([])

  const response = useFetch('/data')

  useEffect(() => {
    if (response.data) { setData(response.data) }
  }, [response.data])

  return (
    <div>
      <Filters farms={farms} />
      <DataTable data={data} />
    </div>
  )
}
