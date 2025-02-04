import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Box,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

export function CustomTableHeader({
  order,
  orderBy,
  onRequestSort,
  headCells,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: 'bold'}}
          >
            {headCell.enableOrder ? (
              <Typography variant='h5' fontWeight={'bold'}>
                {headCell.label}
              </Typography>
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                <Typography variant='h5' fontWeight={'bold'}>
                  {headCell.label}
                </Typography>
                {orderBy === headCell.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
