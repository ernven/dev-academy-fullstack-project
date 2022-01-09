import { useMemo } from 'react'

import Table from './Table'

// This is an implementation of the table from Table.js with our data.
function RoomList ({ data }) {

  // We memoize the data to be passed.
  const tableData = useMemo(() => data, [data])

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

export default RoomList
