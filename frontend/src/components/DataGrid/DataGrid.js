import { useMemo } from 'react'
import { AgGridReact } from '@ag-grid-community/react'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'

import useFetch from '../../utils/useFetch'

import '@ag-grid-community/core/dist/styles/ag-grid.css'
import '@ag-grid-community/core/dist/styles/ag-theme-material.css'

export default function DataGrid() {

  const { data } = useFetch('data')

  // Defining the data and columns, memoized to prevent unnecessary updates.
  const farmsData = useMemo(() => data ? data : [], [data])

  const columnDefs = useMemo(() => [
    {
      headerName: 'Farm Name', field: 'farm_name', filter: true, floatingFilter: true, flex: 1.5
    },
    {
      headerName: 'Date', field: 'date', valueFormatter: row => (new Date(row.value)).toLocaleString(), flex: 1.5
    },
    {
      headerName: 'Type', field: 'entry_type', valueFormatter: row => row.value === 'rainFall' ? 'rainfall' : row.value,
      filter: true, floatingFilter: true, flex: 1
    },
    {
      headerName: 'Value', field: 'read_value', filter: true, floatingFilter: true, flex: 1
    },
  ], [])

  const defaultColDef = useMemo(() => ({
    sortable: true,
  }), [])

  const modules = useMemo(() => [ClientSideRowModelModule], [])

  return (
  <div style={{height: '80vh', width: '60vw'}}>
    <AgGridReact
      className='ag-theme-material'
      animateRows='true'
      modules={modules}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      rowData={farmsData}>
    </AgGridReact>
  </div>
  )
}
