import { useTable } from 'react-table'
import { Table as MaterialTable, TableBody, TableHead, TableRow, TableCell } from '@mui/material'

// Creating a default prop getter
const defaultPropGetter = () => ({})

// We pass columns and data to build the table with as props.
export default function Table({ columns, data, getCellProps = defaultPropGetter }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  return (
    <div>
      {/* Row used for filtering. */}
      <MaterialTable {...getTableProps()} >
        <TableBody>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps()} >
                  {column.canFilter ? column.render('Filter') : null}
                    </TableCell>
                  ))}
            </TableRow>
          ))}
        </TableBody>
      </MaterialTable>
      {/* Our "rooms" table. */}
        <MaterialTable stickyHeader {...getTableProps()} >            
          <TableHead>
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                  <TableCell {...column.getHeaderProps()} >
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
