import { useState, useEffect, useCallback } from 'react';
import { MODAL_MODE } from '../../constants/Enums';
import {
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import './RoleModal.css';

const roleBase = {
  name: '',
};

export function RoleModal({ isOpen, onClose, onSubmit, mode, role }) {
  const [roleForm, setRoleForm] = useState(roleBase);
  const [isDisabled, setIsDisable] = useState(false);
  const [nameError, setNameError] = useState(false);

  const fillData = useCallback(() => {
    if (role) {
      setRoleForm((prevRoleForm) => ({
        ...prevRoleForm,
        name: role.name,
      }));
    }
  }, [role]);

  const initializeModal = useCallback(() => {
    setNameError(false);
    switch (mode) {
      case MODAL_MODE.EDIT:
        fillData();
        setIsDisable(false);
        break;
      case MODAL_MODE.VIEW:
        fillData();
        setIsDisable(true);
        break;
      default:
        setRoleForm(roleBase);
        setIsDisable(false);
    }
  }, [fillData, mode]);

  useEffect(() => {
    initializeModal();
  }, [initializeModal]);

  const getTitle = () => {
    let res;
    switch (mode) {
      case MODAL_MODE.EDIT:
        res = `Edit role ${role.name}`;
        break;
      case MODAL_MODE.VIEW:
        res = role.name;
        break;
      default:
        res = 'Create role';
    }
    return res;
  };

  const changeRoleForm = (role, attribute) => {
    let newRole = { ...roleForm };
    if(attribute==='isEnabled')
    {
      newRole[attribute] = role.target.checked;
    }
    else{
      newRole[attribute] = role.target.value;
    }
    
    setRoleForm(newRole);
  };

const handleSubmitModal = () => {
  let valid = true;

  if (roleForm.name === '') {
    setNameError(true);
    valid = false;
  } else {
    setNameError(false);
  }

  if (valid) {
    onSubmit(roleForm);
    setRoleForm(roleBase);
  }
};

  const handleCloseModal = () => {
    setNameError(false);

    if (mode === MODAL_MODE.CREATE) {
      setRoleForm(roleBase);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleCloseModal} fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent dividers>
        <Box className='roleModal-container'>
          <TextField
            label='Name'
            variant='outlined'
            value={roleForm.name}
            onChange={(event) => changeRoleForm(event, 'name')}
            disabled={isDisabled}
            fullWidth
            required
            error={nameError}
            helperText={nameError && 'This field must not be empty.'}
          />
        </Box>
      </DialogContent>
      {!isDisabled && (
        <DialogActions>
          <Button onClick={handleCloseModal} color='error'>
            Cancel
          </Button>
          <Button onClick={handleSubmitModal} variant='contained'>
            Save
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
