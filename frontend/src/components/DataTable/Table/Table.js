import { useMemo } from 'react'
import { useTable, useSortBy, useFilters } from 'react-table'
import {  Table as MaterialTable, TableBody, TableHead,
  TableRow, TableCell, TableSortLabel, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

// Creating a default prop getter
const defaultPropGetter = () => ({})

// This is used (at the moment!) by the filter/search functionality of the table
 const columnFilter = ({ column: { filterValue, setFilter }, }) => (
     <TextField
         placeholder='all'
         value={filterValue || ''}
         onChange={e => setFilter(e.target.value || undefined)}
         InputProps={{
             startAdornment: <SearchIcon fontSize='small' color='disabled' />,
             style: {height: '1.75em', width: '80%', margin: '0 0.6rem 0.3rem', fontSize: '0.875rem', padding: '0.8rem'} }} />)

// We pass columns and data to build the table with as props.
export default function Table({ columns, data, getCellProps = defaultPropGetter }) {

  const defaultColumn = useMemo(() => ({ Filter: columnFilter }), [])
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data, defaultColumn }, useFilters, useSortBy)

  return (
    <div>
      {/* Here is the data table. */}
      <MaterialTable stickyHeader {...getTableProps()} >
        <TableHead>

          {/* Row used for filtering. */}
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps(column.getSortByToggleProps())} >
                  {column.canFilter ? column.render('Filter') : null}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {/* Used for sorting. */}
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps(column.getSortByToggleProps())} >
                  {column.id !== 'selected' ? (
                    <TableSortLabel
                      active={column.isSorted}
                      direction={column.isSortedDesc ? 'desc' : 'asc'} />
                  ) : null }
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>

        <TableBody {...getTableBodyProps()} >
          {rows.map(row => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()} >
                {row.cells.map(cell => {
                return (
                  <TableCell {...cell.getCellProps([
                    getCellProps(cell)
                  ])} >
                    {cell.render('Cell')}
                  </TableCell>
                  )}
                )}
              </TableRow>
            )}
          )}
        </TableBody>

      </MaterialTable>
    </div>
  )
}
