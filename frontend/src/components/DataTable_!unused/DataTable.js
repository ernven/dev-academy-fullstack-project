import { useState, useEffect, useMemo } from 'react'

import useFetch from '../../utils/useFetch'

import Table from './Table/Table'

// This is an implementation of the table from Table.js with our data.
export default function DataTable() {
  const [farmsData, setFarmsData] = useState([])

  const { data } = useFetch('data')

  useEffect(() => {
    if (data) { setFarmsData(data) }
  }, [data])

  // We memoize the data to be passed.
  const tableData = useMemo(() => farmsData, [farmsData])

  // Setting table columns.
  const columns = useMemo(() => [
    {
      Header: 'Farm',
      accessor: 'farm_name',
    }, {
      Header: 'Date',
      accessor: 'date',
      // This is used for formatting the date.
      Cell: row => (new Date(row.value)).toLocaleString(),
    }, {
      Header: 'Sensor Type',
      accessor: 'entry_type',
      Cell: row => row.value === 'rainFall' ? 'rainfall' : row.value,
    }, {
      Header: 'Value',
      accessor: 'read_value',
    },
  ], [])

  // Using react-table v7 (component Table.js)
  return (<Table columns={columns} data={tableData} />)
}
