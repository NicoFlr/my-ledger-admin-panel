import { useState, useMemo, useCallback } from 'react';
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
  Typography,
} from '@mui/material';
import { CustomTableHeader } from '../custom-table-header/CustomTableHeader';
import { ORDER_BY } from '../../constants/Enums';

export function CustomTablePagination({
  rows,
  headCells,
  initialOrder,
  children,
}) {
  const [order, setOrder] = useState(ORDER_BY.ASC);
  const [orderBy, setOrderBy] = useState(initialOrder);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const descendingComparator = (a, b, orderBy) => {
    if ((b[orderBy] || '').toUpperCase() < (a[orderBy] || '').toUpperCase()) {
      return -1;
    }
    if ((b[orderBy] || '').toUpperCase() > (a[orderBy] || '').toUpperCase()) {
      return 1;
    }
    return 0;
  };

  const getComparator = useCallback((order, orderBy) => {
    return order === ORDER_BY.DESC
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }, []);

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === ORDER_BY.ASC;
    setOrder(isAsc ? ORDER_BY.DESC : ORDER_BY.ASC);
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows, getComparator]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Paper
      sx={{
        border: 'none',
        boxShadow: 'none',
      }}
    >
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby='tableTitle'
          size={'medium'}
        >
          <CustomTableHeader
            rder={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headCells={headCells}
          />
          <TableBody>
            {visibleRows.map((row, index) => children(row, index))}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to, count }) => (
          <Typography variant='paragraph'>
            {from}-{to} of {count !== -1 ? count : `more than ${to}`}
          </Typography>
        )}
        labelRowsPerPage={
          <Typography variant='paragraph'>Show rows per page</Typography>
        }
      />
    </Paper>
  );
}
