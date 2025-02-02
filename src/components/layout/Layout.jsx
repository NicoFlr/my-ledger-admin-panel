import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from '../header-nav/HeaderNavigation';
import { SESSION_STORAGE } from '../../constants/sessionStorageConstants';

const Layout = () => {
  const auth = sessionStorage.getItem(SESSION_STORAGE.JWT);

  return (
    <>
      {auth ? (
        <div>
          <Header />
            <Outlet />


        </div>
      ) : (
        <Navigate to='/' />
      )}
    </>
  );
};

export default Layout;
