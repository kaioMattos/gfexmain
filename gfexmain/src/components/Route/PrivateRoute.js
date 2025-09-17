import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../useContext/AuthContext'; // Assumindo que você tem um contexto de autenticação

function PrivateRoute({ element, allowedProfiles}) {
   const { user } = useAuth();
   console.log(user)
  if (!user.isRegistered) return <Navigate to="/cadastro" />;
  if (allowedProfiles && !allowedProfiles.includes(user.profileType))
    return <Navigate to="/" />;

  return element;
}

export default PrivateRoute;