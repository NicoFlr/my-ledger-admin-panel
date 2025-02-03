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
import { getAllUsers, createNewUser, editUser, deleteUser } from '../../services/userService';
import { showLoading, hideLoading } from '../../redux/loadingSlice';
import { useDispatch } from 'react-redux';
import './Users.css';
import { RiPencilLine, RiDeleteBin2Line  } from '@remixicon/react';
import { UserModal } from '../../components/user-modal/UserModal';
import { MODAL_MODE } from '../../constants/Enums';
import { showSnackbar } from '../../redux/snackbarSlice';

export function Users() {
  const [users, setUsers] = useState([]);
  const [modalMode, setModalMode] = useState(MODAL_MODE.CREATE);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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
  
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSubmitModal = async (user) => {
    if (modalMode === MODAL_MODE.CREATE) {
      await postUser(user);
    }
    if (modalMode === MODAL_MODE.EDIT) {
      await updateUser(user);
    }
  };
  
    const handleClickEditUser = (userRow) => {
    setModalMode(MODAL_MODE.EDIT);
    setSelectedUser(userRow);
    setIsOpen(true);
  };

  const handleClickCreateUser = () => {
    setModalMode(MODAL_MODE.CREATE);
    setIsOpen(true);
  };
  
    const postUser = async (user) => {
    dispatch(showLoading());
    let response;
    try {
      response = await createNewUser(user);
      if (response) {
        let newUsers = [...users];
        newUsers.push(response.data);
        setUsers(newUsers);
        setIsOpen(false);
        let message = 'The user with Email: ' +
          response.data.email + 'was created successfully'
        
        dispatch(
          showSnackbar({
            message: message,
            severity: 'success',
          })
        );
      }
    } catch (error) {
      console.error(`Error creating users => ${error}`);
      if (error.response.status === 409) {
        let message = 'You can not create a user with the email'+user.email+' because that email is already registered.'
        dispatch(
          showSnackbar({
            message: message,
            severity: 'error',
          })
        );
      } else {
        dispatch(
          showSnackbar({
            message: 'There was an error with the server, please try again later',
            severity: 'error',
          })
        );
      }
    }
    dispatch(hideLoading());
  };
  
    const updateUser = async (user) => {
    dispatch(showLoading());
    let response;
    try {
      response = await editUser(user, selectedUser.id);
      if (response) {
        let newUsers = [...users];
        const index = newUsers.findIndex((item) => item.id === selectedUser.id);
        if (index !== -1) {
          newUsers[index] = response.data;
        }
        setUsers(newUsers);
        setIsOpen(false);
        let message = 'The user with email' +  response.data.email +  ' was updated successfully'
        dispatch(
          showSnackbar({
            message: message,
            severity: 'success',
          })
        );
      }
    } catch (error) {
      console.error(`Error editing user => ${error}`);
      if (error.response.status === 409) {
        let message = 'You can not update a user with the email' + user.email + ' because the email is already registered.'
        dispatch(
          showSnackbar({
            message: message,
            severity: 'error',
          })
        );
      } else {
        dispatch(
          showSnackbar({
            message: "There was an error with the server, please try again later",
            severity: 'error',
          })
        );
      }
    }
    dispatch(hideLoading());
  };

  const removeUser = async (userRow) => {
    dispatch(showLoading());
    let response;
    try {
      response = await deleteUser(userRow.id);
      if (response) {
        let newUsers = [...users];
        const index = newUsers.findIndex((item) => item.id === userRow.id);
        if (index !== -1) {
          newUsers.splice(index, 1);
        }
        setUsers(newUsers);
        setIsOpen(false);
        let message = 'The user with email' +  response.data.email +  ' was deleted successfully'
        dispatch(
          showSnackbar({
            message: message,
            severity: 'success',
          })
        );
      }
    } catch (error) {
      console.error(`Error deleting user => ${error}`);
      if (error.response.status === 405) {
        let message = 'Unable to Delete User'
        dispatch(
          showSnackbar({
            message: message,
            severity: 'error',
          })
        );
      } else {
        dispatch(
          showSnackbar({
            message: 'There are an error with the server, please try again later',
            severity: 'error',
          })
        );
      }
    }
    dispatch(hideLoading());
  };

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
          onClick={handleClickCreateUser}
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
                    onClick={() => handleClickEditUser(row)}
                  >
                    <RiPencilLine size={20} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Delete User'>
                  <IconButton
                    onClick={() => removeUser(row)}
                    aria-label='delete'
                    className='users-icon-custom-style'
                  >
                    <RiDeleteBin2Line size={20} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          )}
        </CustomTablePagination>
      )}
      <UserModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
        mode={modalMode}
        user={selectedUser}
      />
    </Container>
  );
}
