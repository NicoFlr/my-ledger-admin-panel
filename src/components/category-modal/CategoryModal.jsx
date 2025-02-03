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
import './CategoryModal.css';

const categoryBase = {
  name: '',
};

export function CategoryModal({ isOpen, onClose, onSubmit, mode, category }) {
  const [categoryForm, setCateogryForm] = useState(categoryBase);
  const [isDisabled, setIsDisable] = useState(false);
  const [nameError, setNameError] = useState(false);

  const fillData = useCallback(() => {
    if (category) {
      setCateogryForm((prevCateogryForm) => ({
        ...prevCateogryForm,
        name: category.name,
      }));
    }
  }, [category]);

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
        setCateogryForm(categoryBase);
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
        res = `Edit category ${category.firstName} ${category.lastName}`;
        break;
      case MODAL_MODE.VIEW:
        res = category.email;
        break;
      default:
        res = 'Create category';
    }
    return res;
  };

  const changeCateogryForm = (category, attribute) => {
    let newCateogry = { ...categoryForm };
    if(attribute==='isEnabled')
    {
      newCateogry[attribute] = category.target.checked;
    }
    else{
      newCateogry[attribute] = category.target.value;
    }
    
    setCateogryForm(newCateogry);
  };

const handleSubmitModal = () => {
  let valid = true;

  if (categoryForm.name === '') {
    setNameError(true);
    valid = false;
  } else {
    setNameError(false);
  }

  if (valid) {
    onSubmit(categoryForm);
    setCateogryForm(categoryBase);
  }
};

  const handleCloseModal = () => {
    setNameError(false);

    if (mode === MODAL_MODE.CREATE) {
      setCateogryForm(categoryBase);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleCloseModal} fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent dividers>
        <Box className='categoryModal-container'>
          <TextField
            label='Name'
            variant='outlined'
            value={categoryForm.name}
            onChange={(event) => changeCateogryForm(event, 'name')}
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
