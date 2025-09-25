import React, { createContext, useContext, useState } from 'react';

const AcessRequestContext = createContext();

export const AccessCtx = () => useContext(AcessRequestContext);

export const AcessRequestProvider = ({ children }) => {
  const [form, setForm] = useState('');
  return (
    <AcessRequestContext.Provider value={{ form, setForm }}>
      {children}
    </AcessRequestContext.Provider>
  );
};