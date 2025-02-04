import { useState, useEffect, useCallback } from 'react';
import { MODAL_MODE } from '../../constants/Enums';
import { useSelector } from 'react-redux';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import './UserModal.css';

const userBase = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  roleId: '',
};

export function UserModal({ isOpen, onClose, onSubmit, mode, user }) {
  const [userForm, setUserForm] = useState(userBase);
  const [isDisabled, setIsDisable] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [roleError, setRoleError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const { userRoles } = useSelector((state) => state.roles);

  const fillData = useCallback(() => {
    if (user) {
      setUserForm((prevUserForm) => ({
        ...prevUserForm,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        roleId: user.roleId,
      }));
    }
  }, [user]);

  const initializeModal = useCallback(() => {
    setNameError(false);
    setRoleError(false);
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
        setUserForm(userBase);
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
        res = `Edit user ${user.firstName} ${user.lastName}`;
        break;
      case MODAL_MODE.VIEW:
        res = user.email;
        break;
      default:
        res = 'Create user';
    }
    return res;
  };

  const changeUserForm = (user, attribute) => {
    let newUser = { ...userForm };
    if(attribute==='isEnabled')
    {
      newUser[attribute] = user.target.checked;
    }
    else{
      newUser[attribute] = user.target.value;
    }
    
    setUserForm(newUser);
  };

const handleSubmitModal = () => {
  let valid = true;

  if (userForm.name === '') {
    setNameError(true);
    valid = false;
  } else {
    setNameError(false);
  }

  if (userForm.roleId === '') {
    setRoleError(true);
    valid = false;
  } else {
    setRoleError(false);
  }

  if (userForm.email === '' || !userForm.email.includes('@')) {
    setEmailError(true);
    valid = false;
  } else {
    setEmailError(false);
  }

  if (userForm.password === '') {
    setPasswordError(true);
    valid = false;
  } else {
    setPasswordError(false);
  }

  if (valid) {
    onSubmit(userForm);
    setUserForm(userBase);
  }
};

  const handleCloseModal = () => {
    setRoleError(false);
    setNameError(false);
    setEmailError(false);
    setPasswordError(false);

    if (mode === MODAL_MODE.CREATE) {
      setUserForm(userBase);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleCloseModal} fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent dividers>
        <Box className='userModal-container'>
          <TextField
            label='First Name'
            variant='outlined'
            value={userForm.firstName}
            onChange={(event) => changeUserForm(event, 'firstName')}
            disabled={isDisabled}
            fullWidth
            required
            error={nameError}
            helperText={nameError && 'This field must not be empty.'}
          />
          <TextField
            label='Last Name'
            variant='outlined'
            value={userForm.lastName}
            onChange={(event) => changeUserForm(event, 'lastName')}
            disabled={isDisabled}
            fullWidth
          />
          <TextField
            label='Email'
            variant='outlined'
            value={userForm.email}
            onChange={(event) => changeUserForm(event, 'email')}
            disabled={isDisabled}
            fullWidth
            required
            error={emailError}
            helperText={emailError && 'This field must not be empty or invalid.'}
          />
          {mode !== MODAL_MODE.EDIT && (
          <TextField
            label='Password'
            variant='outlined'
            value={userForm.password}
            onChange={(event) => changeUserForm(event, 'password')}
            disabled={isDisabled}
            fullWidth
            required
            error={passwordError}
            helperText={passwordError && 'This field must not be empty or invalid.'}
          />)}
          <FormControl fullWidth margin='normal' error={roleError}>
            <InputLabel id='select-role-label' required>
              Select Role
            </InputLabel>
            <Select
              labelId='select-role-label'
              id='select-role'
              value={userForm.roleId}
              label="Select Role"
              onChange={(event) => changeUserForm(event, 'roleId')}
              disabled={isDisabled}
            >
              {userRoles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            {roleError && (
              <FormHelperText>You must choose a role.</FormHelperText>
            )}
          </FormControl>
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
