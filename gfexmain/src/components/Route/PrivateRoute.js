import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../useContext/AuthContext';

function PrivateRoute({ element, allowedProfiles }) {
  const { user } = useAuth();
  const isNotRegistered = !user.isRegistered;
  const isValidatedPetroIncomplete = user.infoS4H?.validatedPetro && user.infoS4H.validatedPetro !== 'concluido';
  if (user.profileType === 'petrobras') return <Navigate to="/Report" />;
  if (isNotRegistered || isValidatedPetroIncomplete) return <Navigate to="/cadastro" />

  return element;
}

export default PrivateRoute;