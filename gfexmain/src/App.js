import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getUserHana } from "./api";
import { useDashboard } from './useContext';
import Header from './components/header';
import NewHeader from './pages/components/Header'
import NavLink from './components/breadcrumbs';
import Home from './pages/Main';
import Marketing from './pages/Marketing';
import TecInfo from './pages/TecInfo';
import ValidarTecInfo from './pages/TecInfo/ValidarTecInfo';
import TelaErroPermissao from './pages/NotPermission';
import "./App.css";
import theme from './StylesTheme';
import { CssBaseline, Box, CircularProgress } from "@mui/material";
import MaterialManagementPlatform from './pages/Home';
import InformacoesTecnicas from './pages/InfoTec';

const App = () => {

  const loadInitData = async (isFirstLoad) => {
    setLoadingPage(true);
    // const user = await getUserLogged();
    // const usersS4 = await getUsersS4Data();
    // const usersS4 = await getUserHana({$filter: `documentId eq '03680252000105'`});
    const usersS4 = await getUserHana({ $filter: `documentId eq '${process.env.REACT_APP_SUPPLIER_TEST}'` });
    try {
      if (isFirstLoad) {
        await setSupplierContext(usersS4);
      }
    } finally {
      setLoadingPage(false);
    }
  }
  useEffect(() => {
    loadInitData(true);
  }, []);

  const { supplier, setSupplierContext, loadingPage, setLoadingPage, loadData } = useDashboard();
  useEffect(() => {
    loadData();
  }, [supplier]);
  
  return (
    <ThemeProvider theme={theme}>

      {supplier.validatedPetro === 'concluido' ? (
        <>
          {process.env.REACT_APP_APP_ACTIVE === 'OLD' ? (
            <>
              <Header />
              {loadingPage ? (
                <div className="initLoading">
                  <CircularProgress disableShrink={loadingPage} />
                </div>
              ) : (
                <div className="body">
                  <NavLink />
                  <Routes>
                    <Route path='/gfexmain/index.html' element={<Home />} />
                    <Route path='/gfexmain/TecInfo' element={<TecInfo />}></Route>
                    <Route path='gfexmain/ValidarDadosTec' element={<ValidarTecInfo />} />
                    <Route path='/gfexmain/Marketing' element={<Marketing />} />
                  </Routes>
                </div>)}
            </>

          ) : (
            <>
              <CssBaseline />
              <Box sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
                {/* Header */}
                <NewHeader />
                {loadingPage ? (
                  <div className="initLoading">
                    <CircularProgress disableShrink={loadingPage} />
                  </div>
                ) : (
                  <>
                    <Routes>
                      <Route path='/index.html' element={<MaterialManagementPlatform />} />
                      <Route path='/gfexmain/TecInfo' element={<TecInfo />} />
                      <Route path='/ValidarDadosTec' element={<ValidarTecInfo />} />
                      <Route path='/Marketing' element={<Marketing />} />
                    </Routes>
                  </>)}
              </Box>
            </>
          )}
        </>
      ) : (
        <TelaErroPermissao />
      )}
    </ThemeProvider>

  )

};

export default App;
