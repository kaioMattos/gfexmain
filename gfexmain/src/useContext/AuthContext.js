import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const login = (userData) => {
    const employeePetro = userData.attributes["xs.rolecollections"].includes('MembrosPetrobras');
    const profile = employeePetro ? 'petrobras' : 'fornecedor';
    const profileIsRegistered = employeePetro === 'petrobras'?true:
     !!Object.keys(userData.infoS4H).length
    setUser({ ...userData, profileType: profile, isRegistered:profileIsRegistered });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};