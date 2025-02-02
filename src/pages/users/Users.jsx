import { useState, useEffect, useCallback } from 'react';
import {
  TableRow,
  TableCell,
  Box,
  Typography,
  IconButton,
  Button,
  Tooltip,
  Container,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CustomTablePagination } from '../../components/custom-table-pagination/CustomTablePagination';
import { getAllUsers } from '../../services/userService';
import { showLoading, hideLoading } from '../../redux/loadingSlice';
import { useDispatch } from 'react-redux';
import './Users.css';
import { RiPencilLine } from '@remixicon/react';

export function Users() {
  const [users, setUsers] = useState([]);

  const dispatch = useDispatch();

  const headCells = [
    {
      id: 'FirstName',
      numeric: false,
      disablePadding: false,
      label: 'First Name',
      enableOrder: false,
    },
    {
      id: 'LastName',
      numeric: false,
      disablePadding: false,
      label: 'Last Name',
      enableOrder: false,
    },
    {
      id: 'email',
      numeric: false,
      disablePadding: false,
      label: 'Email',
      enableOrder: false,
    },
    {
      id: 'role.name',
      numeric: false,
      disablePadding: false,
      label: 'Role',
      enableOrder: false,
    },
    {
      id: 'actions',
      numeric: false,
      disablePadding: false,
      label: 'Actions',
      enableOrder: true,
    },
  ];

  const fetchUsers = useCallback(async () => {
    dispatch(showLoading());
    let response;
    try {
      response = await getAllUsers();
      if (response) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error(`Error getting users => ${error}`);
    }
    dispatch(hideLoading());
  }, [dispatch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Container maxWidth='lg'>
      <Box className='users-header users-space'>
        <Typography variant='h2' fontWeight={'bold'}>
          Users
        </Typography>
        <Button
          variant='contained'
          size='small'
          startIcon={<AddIcon />}
        >
          Create User
        </Button>
      </Box>
      {users.length > 0 && (
        <CustomTablePagination
          rows={users}
          headCells={headCells}
          initialOrder={'name'}
        >
          {(row, index) => (
            <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
              <TableCell>
                <Typography variant='h5'>{row.firstName}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h5'>{row.lastName}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h5'>{row.email}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h5'>{row.role.name}</Typography>
              </TableCell>
              <TableCell sx={{ display: 'flex', gap: 2 }}>
                <Tooltip title='Edit User'>
                  <IconButton
                    aria-label='edit'
                  >
                    <RiPencilLine size={20} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          )}
        </CustomTablePagination>
      )}
    </Container>
  );
}
