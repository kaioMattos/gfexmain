import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getUserHana } from "api";
import { useDashboard } from 'useContext';
import Header from 'components/header';
import NavLink from 'components/breadcrumbs';
import Home from 'pages/Home';
import Marketing from 'pages/Marketing';
import TecInfo from 'pages/TecInfo';
import ValidarTecInfo from 'pages/TecInfo/ValidarTecInfo';
import TelaErroPermissao from 'pages/NotPermission'
import "./App.css";

const theme = createTheme({
  typography: {
    fontFamily: 'PetrobrasSans_Rg'
  },
});

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
      {supplier.validatedPetro === 'concluido' ? (
        <>
          <Header />
          <div className="body">
            <NavLink />
            <Routes>
              <Route path='/gfexmain/index.html' element={<Home />} />
              <Route path='/gfexmain/TecInfo' element={<TecInfo />}></Route> 
                <Route path='gfexmain/ValidarDadosTec' element={<ValidarTecInfo />} />
              <Route path='/gfexmain/Marketing' element={<Marketing />} />
            </Routes>
          </div>
        </>
      ) : (
        <TelaErroPermissao />
      )}
    </ThemeProvider>
  )
};

export default App;
