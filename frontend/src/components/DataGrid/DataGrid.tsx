import { useState, useEffect, useMemo } from 'react'
import { AgGridReact } from '@ag-grid-community/react'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'

import '@ag-grid-community/core/dist/styles/ag-grid.css'
import '@ag-grid-community/core/dist/styles/ag-theme-material.css'
// Custom css to center the headers.
import './DataGrid.css'

export default function DataGrid() {
  const [farmsData, setFarmsData] = useState([])

  const fetchData = (signal: AbortSignal) =>
    fetch('data', { signal: signal })
      .then(res => res.status === 200 ? res.json() : null)
      .then(data => setFarmsData(data))
      .catch(err => console.log(err))

  useEffect(() => {
    const abortController = new AbortController()
    fetchData(abortController.signal)

    return () => abortController.abort()    // cleanup
  }, [])

  // Defining the data and columns, memoized to prevent unnecessary updates.
  const tableData = useMemo(() => farmsData, [farmsData])

  const columnDefs = useMemo(() => [
    {
      headerName: 'Farm Name', field: 'farm_name', filter: true, floatingFilter: true, flex: 1.5
    },
    {
      headerName: 'Date', field: 'date', valueFormatter: (row: {value: string}) => (new Date(row.value)).toLocaleString(), flex: 1.5
    },
    {
      headerName: 'Type', field: 'entry_type', valueFormatter: (row: {value: string}) => row.value === 'rainFall' ? 'rainfall' : row.value,
      filter: true, floatingFilter: true, flex: 1
    },
    {
      headerName: 'Value', field: 'read_value', filter: true, floatingFilter: true, flex: 1
    },
  ], [])

  const defaultColDef = useMemo(() => ({
    sortable: true,
    cellStyle: {textAlign: 'center'}
  }), [])

  const modules = [ClientSideRowModelModule];

  return (
  <div id='container'>
    <AgGridReact
      className='ag-theme-material'
      animateRows={true}
      rowData={tableData}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      modules={modules}
    >
    </AgGridReact>
  </div>
  )
}
