import { useState, useEffect, useMemo } from 'react'
import { AgGridReact } from '@ag-grid-community/react'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'

import '@ag-grid-community/core/dist/styles/ag-grid.css'
import '@ag-grid-community/core/dist/styles/ag-theme-material.css'
// Custom css to center the headers.
import './DataGrid.css'

export default function DataGrid() {
  const [farmsData, setFarmsData] = useState([])

  useEffect(() => 
    fetch(process.env.REACT_APP_API_URL + 'data')
      .then(res => res.status === 200 ? res.json() : null)
      .then(data => setFarmsData(data))
      .catch(err => console.log(err))
  , [])

  // Defining the data and columns, memoized to prevent unnecessary updates.
  const tableData = useMemo(() => farmsData, [farmsData])

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
    cellStyle: {textAlign: 'center'}
  }), [])

  const modules = useMemo(() => [ClientSideRowModelModule], [])

  return (
  <div style={{height: '80vh', width: '78vw'}}>
    <AgGridReact
      className='ag-theme-material'
      animateRows='true'
      modules={modules}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      rowData={tableData}>
    </AgGridReact>
  </div>
  )
}
