import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import TelaErroPermissao from './pages/NotPermission'
import { getUserHana, getCountIndicator, getTableData } from "api";
import { _assembleOrFilterGeneric } from './utils';
import Dashboard from './features/dashboard'

import "./App.css";
import { useDashboard } from './useContext';

const theme = createTheme({
  typography: {
    fontFamily: 'PetrobrasSans_Rg'
  },
});

const PAGE_SIZE = 200000;

const App = () => {

  const loadData = async (isFirstLoad) => {
    setLoadingPage(true);
    // const user = await getUserLogged();
    // const usersS4 = await getUsersS4Data();
    // const usersS4 = await getUserHana({$filter: `documentId eq '03680252000105'`});
    const usersS4 = await getUserHana({ $filter: `documentId eq '${process.env.REACT_APP_SUPPLIER_TEST}'` });
    try {
      if (isFirstLoad) {
        setSupplierContext(usersS4);
      }
    } finally {
      setLoadingPage(false);
    }
  }
  useEffect(() => {
    loadData(true);
  }, []);

  const { supplier, setSupplierContext, loadingPage, setLoadingPage } = useDashboard();
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        {supplier.validatedPetro === 'concluido' ? (
          <Dashboard />
        ) : (
          <TelaErroPermissao />
        )}
      </div>
    </ThemeProvider>
  );
}
export default App;
