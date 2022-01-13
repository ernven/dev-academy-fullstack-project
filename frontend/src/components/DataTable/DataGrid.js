import {AgGridColumn, AgGridReact} from 'ag-grid-react'

import useFetch from '../../utils/useFetch'

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

export default function DataGrid() {
  const { data } = useFetch('data')

  // Date picker??

  return (
      <div className='ag-theme-alpine' style={{height: '80vh', width: '60vw'}}>
          <AgGridReact rowData={data}>
              <AgGridColumn
                headerName='Farm Name'
                field='farm_name'
                sortable={true}
                filter={true}
                floatingFilter={true}
                flex={1.5}
              />
              <AgGridColumn
                headerName='Date'
                field='date'
                valueFormatter={row => (new Date(row.value)).toLocaleString()}
                sortable={true}
                flex={1.5}
              />
              <AgGridColumn
                headerName='Type'
                field='entry_type'
                valueFormatter={row => row.value === 'rainFall' ? 'rainfall' : row.value}
                sortable={true}
                filter={true}
                floatingFilter={true}
                flex={1}
              />
              <AgGridColumn
                headerName='Value'
                field='read_value'
                sortable={true}
                filter={true}
                floatingFilter={true}
                flex={1}
              />
          </AgGridReact>
      </div>
  )
}