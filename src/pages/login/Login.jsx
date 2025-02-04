import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { SESSION_STORAGE } from '../../constants/sessionStorageConstants';
import { jwtDecode } from 'jwt-decode';
import { login } from '../../services/userService';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/userSlices';
import { useNavigate } from 'react-router-dom';
import { showLoading, hideLoading } from '../../redux/loadingSlice';
import { getAllRoles } from '../../services/rolesSlices';
import { setUserRoles } from '../../redux/roleSlices';
import { setSessionStorageItem } from '../../services/sessionStorageService';
import { showSnackbar } from '../../redux/snackbarSlice';
import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';
import './Login.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordType, setPasswordType] = useState('password');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const IncorrectEmail = () => {
    return !email.includes('@') || email === '';
  };

  const IncorrectPassword = () => {
    return password === '';
  };

  const loginSession = async (headers) => {
    let result;
    try {
      result = await login(headers);
    } catch (error) {
      console.error(`Error login user => ${error}`);
      if (error.response.status === 401) {
        dispatch(
          showSnackbar({
            message: 'The email or password are incorrect, please try again.',
            severity: 'error',
          })
        );
      }
    }
    return result;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (IncorrectEmail()) {
      setEmailError(true);
    } else {
      if (IncorrectPassword()) {
        setPasswordError(true);
        setEmailError(false);
      } else {
        dispatch(showLoading());
        setEmailError(false);
        setPasswordError(false);

        const encodedString = btoa(`${email}:${password}`);
        const headers = { auth: `Basic ${encodedString}` };
        let result = await loginSession(headers);

        if (result) {
          if (result.status >= 200) {
            let token = result.headers.getAuthorization().slice(7);
            const decodedToken = jwtDecode(token);
            setSessionStorageItem(SESSION_STORAGE.JWT, token);
            dispatch(loginUser(decodedToken));
            await initializeData();

            navigate('/users', { replace: true });
          }
        }
        dispatch(hideLoading());
      }
    }
  };

  const initializeData = async () => {
    const [roles] =
      await Promise.all([
        getAllRoles(),
      ]);
    dispatch(setUserRoles(roles.data));
  };

  return (
    <Box className='login-container'>
        <Box className='login-form-container'>
          <form onSubmit={handleLogin}>
            <Typography
              variant='h4'
              className='login-title'
              fontWeight={'bold'}
            >
              Login To Your Account
            </Typography>
            <TextField
              id='user-email'
              label='Email'
              variant='outlined'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={emailError}
              fullWidth
              helperText={emailError && 'Please input a valid email.'}
              sx={{ marginTop: '18px' }}
            />
            <TextField
              id='user-password'
              label='Password'
              variant='outlined'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={passwordError}
              fullWidth
              helperText={passwordError && 'Please input a password.'}
              sx={{ marginTop: '18px' }}
              type={passwordType}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {passwordType === 'password' ? (
                      <IconButton
                        onClick={() => setPasswordType('text')}
                        aria-label='show'
                      >
                        <RiEyeLine />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() => setPasswordType('password')}
                        aria-label='show'
                      >
                        <RiEyeOffLine />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant='contained'
              color='primary'
              type='submit'
              sx={{ marginTop: '16px', width: '50%' }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Box>
  );
}
