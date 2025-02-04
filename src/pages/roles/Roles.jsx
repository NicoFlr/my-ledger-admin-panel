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
import { getAllRoles, createNewRole, editRole } from '../../services/rolesSlices';
import { showLoading, hideLoading } from '../../redux/loadingSlice';
import { useDispatch } from 'react-redux';
import './Roles.css';
import { RiPencilLine  } from '@remixicon/react';
import { RoleModal } from '../../components/role-modal/RoleModal';
import { MODAL_MODE } from '../../constants/Enums';
import { showSnackbar } from '../../redux/snackbarSlice';

export function Roles() {
  const [roles, setRoles] = useState([]);
  const [modalMode, setModalMode] = useState(MODAL_MODE.CREATE);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const dispatch = useDispatch();

  const headCells = [
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: 'Name',
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

  const fetchRoles = useCallback(async () => {
    dispatch(showLoading());
    let response;
    try {
      response = await getAllRoles();
      if (response) {
        setRoles(response.data);
      }
    } catch (error) {
      console.error(`Error getting roles => ${error}`);
    }
    dispatch(hideLoading());
  }, [dispatch]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);
  
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSubmitModal = async (role) => {
    if (modalMode === MODAL_MODE.CREATE) {
      await postRole(role);
    }
    if (modalMode === MODAL_MODE.EDIT) {
      await updateRole(role);
    }
  };
  
    const handleClickEditRole = (roleRow) => {
    setModalMode(MODAL_MODE.EDIT);
    setSelectedRole(roleRow);
    setIsOpen(true);
  };

  const handleClickCreateRole = () => {
    setModalMode(MODAL_MODE.CREATE);
    setIsOpen(true);
  };
  
    const postRole = async (role) => {
    dispatch(showLoading());
    let response;
    try {
      response = await createNewRole(role);
      if (response) {
        let newRoles = [...roles];
        newRoles.push(response.data);
        setRoles(newRoles);
        setIsOpen(false);
        let message = 'The role with Email: ' +
          response.data.email + 'was created successfully'
        
        dispatch(
          showSnackbar({
            message: message,
            severity: 'success',
          })
        );
      }
    } catch (error) {
      console.error(`Error creating roles => ${error}`);
        dispatch(
          showSnackbar({
            message: 'There was an error with the server, please try again later',
            severity: 'error',
          })
        );
    }
    dispatch(hideLoading());
  };
  
    const updateRole = async (role) => {
    dispatch(showLoading());
    let response;
    try {
      response = await editRole(role, selectedRole.id);
      if (response) {
        let newRoles = [...roles];
        const index = newRoles.findIndex((item) => item.id === selectedRole.id);
        if (index !== -1) {
          newRoles[index] = response.data;
        }
        setRoles(newRoles);
        setIsOpen(false);
        let message = 'The role with email was updated successfully'
        dispatch(
          showSnackbar({
            message: message,
            severity: 'success',
          })
        );
      }
    } catch (error) {
      console.error(`Error editing role => ${error}`);
        dispatch(
          showSnackbar({
            message: "There was an error with the server, please try again later",
            severity: 'error',
          })
        );
    }
    dispatch(hideLoading());
  };

  return (
    <Container maxWidth='lg'>
      <Box className='roles-header roles-space'>
        <Typography variant='h2' fontWeight={'bold'}>
          Roles
        </Typography>
        <Button
          variant='contained'
          size='small'
          startIcon={<AddIcon />}
          onClick={handleClickCreateRole}
        >
          Create Role
        </Button>
      </Box>
      {roles.length > 0 && (
        <CustomTablePagination
          rows={roles}
          headCells={headCells}
          initialOrder={'name'}
        >
          {(row, index) => (
            <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
              <TableCell>
                <Typography variant='h5'>{row.name}</Typography>
              </TableCell>
              <TableCell sx={{ display: 'flex', gap: 2 }}>
                <Tooltip title='Edit Role'>
                  <IconButton
                    aria-label='edit'
                    onClick={() => handleClickEditRole(row)}
                  >
                    <RiPencilLine size={20} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          )}
        </CustomTablePagination>
      )}
      <RoleModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
        mode={modalMode}
        role={selectedRole}
      />
    </Container>
  );
}
