import DataTable from './components/FilteredDataTable/Table/DataTable'
import Filters from './Filters'

import './FilteredTable.css'

export default function FilteredTable({ farms, data }) {
  return (
    <div>
      <Filters />
      <DataTable data={data} />
    </div>
  )
}
