import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from './redux/userSlices';
import { setUserRoles } from './redux/roleSlices';
import { getAllRoles } from './services/rolesSlices';
import Layout from './components/layout/Layout';
import { Login } from './pages/login/Login';
import { Users } from './pages/users/Users';
import SnackbarMessage from './components/snackbar-message/SnackbarMessage';
import { SESSION_STORAGE } from './constants/sessionStorageConstants';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import { Roles } from './pages/roles/Roles';
import { Categories } from './pages/categories/Categories';

function App() {

  const dispatch = useDispatch();

  const [userData, setUserData] = useState(() => {
    const user = sessionStorage.getItem(SESSION_STORAGE.JWT);
    if (user) {
      const decodedToken = jwtDecode(user);
      dispatch(loginUser(decodedToken));
      return decodedToken;
    }
    return null;
  });

  useEffect(() => {
    const initializeData = async () => {
      const [roles] =
        await Promise.all([
          getAllRoles(),
        ]);
      dispatch(setUserRoles(roles.data));
    };
    if (userData) {
      initializeData();
    }
    setUserData();
  }, [userData, dispatch]);

  return (

  <Router>
  <Routes>
    <Route path='/' element={<Navigate to='/login' />} />
    <Route path='/login' element={<Login />} />
    <Route element={<Layout />}>
      <Route path='/users' element={<Users />} />
      <Route path='/roles' element={<Roles />} />
      <Route path='/categories' element={<Categories />} />
    </Route>
  </Routes>
  <SnackbarMessage />
</Router>
);
}

export default App;
