import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/userSlices';
import { removeSessionStorageItem } from '../../services/sessionStorageService';
import { SESSION_STORAGE } from '../../constants/sessionStorageConstants';
import { useNavigate } from 'react-router-dom';
import './HeaderNavigation.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeSession = () => {
    removeSessionStorageItem(SESSION_STORAGE.JWT);
    dispatch(logoutUser());
    navigate('/', { replace: true });
  };

  return (
    <div className='header-container'>
      <AppBar position='fixed' color='inherit'>
        <Toolbar>
          <Box
            className='header-navOptions'
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <Button
              varian='text'
              color='inherit'
              LinkComponent={Link}
              to='/users'
              style={{ textDecoration: 'none' }}
            >
              <Typography variant='h5'>Users</Typography>
            </Button>
            <Button
              varian='text'
              color='inherit'
              LinkComponent={Link}
              to='/roles'
              style={{ textDecoration: 'none' }}
            >
              <Typography variant='h5'>Roles</Typography>
            </Button>
            <Button
              varian='text'
              color='inherit'
              LinkComponent={Link}
              to='/categories'
              style={{ textDecoration: 'none' }}
            >
              <Typography variant='h5'>Categories</Typography>
            </Button>
          </Box>
          <Box className='header-endOptions' sx={{ display: 'flex' }}>
            <Button onClick={closeSession} color='inherit'>
              <Typography variant='h5'>Logout</Typography>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
