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
import { getAllCategories, createNewCategory, editCategory, deleteCategory } from '../../services/categoriesSlices';
import { showLoading, hideLoading } from '../../redux/loadingSlice';
import { useDispatch } from 'react-redux';
import './Categories.css';
import { RiPencilLine, RiDeleteBin2Line  } from '@remixicon/react';
import { CategoryModal } from '../../components/category-modal/CategoryModal';
import { MODAL_MODE } from '../../constants/Enums';
import { showSnackbar } from '../../redux/snackbarSlice';

export function Categories() {
  const [categories, setCategories] = useState([]);
  const [modalMode, setModalMode] = useState(MODAL_MODE.CREATE);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  const fetchCategories = useCallback(async () => {
    dispatch(showLoading());
    let response;
    try {
      response = await getAllCategories();
      if (response) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error(`Error getting categories => ${error}`);
    }
    dispatch(hideLoading());
  }, [dispatch]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSubmitModal = async (category) => {
    if (modalMode === MODAL_MODE.CREATE) {
      await postCategory(category);
    }
    if (modalMode === MODAL_MODE.EDIT) {
      await updateCategory(category);
    }
  };
  
    const handleClickEditCategory = (categoryRow) => {
    setModalMode(MODAL_MODE.EDIT);
    setSelectedCategory(categoryRow);
    setIsOpen(true);
  };

  const handleClickCreateCategory = () => {
    setModalMode(MODAL_MODE.CREATE);
    setIsOpen(true);
  };
  
    const postCategory = async (category) => {
    dispatch(showLoading());
    let response;
    try {
      response = await createNewCategory(category);
      if (response) {
        let newCategories = [...categories];
        newCategories.push(response.data);
        setCategories(newCategories);
        setIsOpen(false);
        let message = 'The category: ' +
          response.data.name + 'was created successfully'
        
        dispatch(
          showSnackbar({
            message: message,
            severity: 'success',
          })
        );
      }
    } catch (error) {
      console.error(`Error creating categories => ${error}`);
        dispatch(
          showSnackbar({
            message: 'There was an error with the server, please try again later',
            severity: 'error',
          })
        );
      }
    dispatch(hideLoading());
  };
  
    const updateCategory = async (category) => {
    dispatch(showLoading());
    let response;
    try {
      response = await editCategory(category, selectedCategory.id);
      if (response) {
        let newCategories = [...categories];
        const index = newCategories.findIndex((item) => item.id === selectedCategory.id);
        if (index !== -1) {
          newCategories[index] = response.data;
        }
        setCategories(newCategories);
        setIsOpen(false);
        let message = 'The category was updated successfully'
        dispatch(
          showSnackbar({
            message: message,
            severity: 'success',
          })
        );
      }
    } catch (error) {
      console.error(`Error editing category => ${error}`);
        dispatch(
          showSnackbar({
            message: "There was an error with the server, please try again later",
            severity: 'error',
          })
        );
    }
    dispatch(hideLoading());
  };

  const removeCategory = async (categoryRow) => {
    dispatch(showLoading());
    let response;
    try {
      response = await deleteCategory(categoryRow.id);
      if (response) {
        let newCategories = [...categories];
        const index = newCategories.findIndex((item) => item.id === categoryRow.id);
        if (index !== -1) {
          newCategories.splice(index, 1);
        }
        setCategories(newCategories);
        setIsOpen(false);
        let message = 'The category: ' +  response.data.name +  ' was deleted successfully'
        dispatch(
          showSnackbar({
            message: message,
            severity: 'success',
          })
        );
      }
    } catch (error) {
      console.error(`Error deleting category => ${error}`);
      if (error.response.status === 405) {
        let message = 'Unable to Delete Category'
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
      <Box className='categories-header categories-space'>
        <Typography variant='h2' fontWeight={'bold'}>
          Categories
        </Typography>
        <Button
          variant='contained'
          size='small'
          startIcon={<AddIcon />}
          onClick={handleClickCreateCategory}
        >
          Create Category
        </Button>
      </Box>
      {categories.length > 0 && (
        <CustomTablePagination
          rows={categories}
          headCells={headCells}
          initialOrder={'name'}
        >
          {(row, index) => (
            <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
              <TableCell>
                <Typography variant='h5'>{row.name}</Typography>
              </TableCell>
              <TableCell sx={{ display: 'flex', gap: 2 }}>
                <Tooltip title='Edit Category'>
                  <IconButton
                    aria-label='edit'
                    onClick={() => handleClickEditCategory(row)}
                  >
                    <RiPencilLine size={20} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Delete Category'>
                  <IconButton
                    onClick={() => removeCategory(row)}
                    aria-label='delete'
                    className='categories-icon-custom-style'
                  >
                    <RiDeleteBin2Line size={20} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          )}
        </CustomTablePagination>
      )}
      <CategoryModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
        mode={modalMode}
        category={selectedCategory}
      />
    </Container>
  );
}
