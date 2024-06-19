import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Vérifiez si le token est présent dans le localStorage

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
