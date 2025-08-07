import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getUserHana, getUserAzureAriba } from "./api";
import { useDashboard } from './useContext';
import Header from './components/Header'
import Marketing from './pages/Marketing';
import Report from './pages/Report'
import TecInfo from './pages/TecInfo';
import ValidarTecInfo from './pages/TecInfo/ValidarTecInfo';
import TelaErroPermissao from './pages/NotPermission';
import "./App.css";
import theme from './StylesTheme';
import { CssBaseline, Box, CircularProgress } from "@mui/material";
import MaterialManagementPlatform from './pages/Home';
import InformacoesTecnicas from './pages/InfoTec';
import mockUser from './mock/user.json'
import mockUserAriba from './mock/userAriba.json'

const App = () => {

  const loadInitData = async (isFirstLoad) => {
    setLoadingPage(true);
    // const resultUserAriba = await getUserAzureAriba();
    const resultUserAriba = mockUserAriba;
    const userAzure = JSON.parse(resultUserAriba.value);
  
    const groups = userAzure.attributes.hasOwnProperty('xs.saml.groups')?
      userAzure.attributes['xs.saml.groups']:[]
    const userPetro = groups.includes('Petrobras');
    const userS4 = !userPetro ? await getUserHana(process.env.REACT_APP_SUPPLIER_TEST) : {};
    // const usersS4 = mockUser;
    try {
      if (isFirstLoad) {
        await setSupplierContext(userS4, userAzure);
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
      {loadingPage ? (
        <div className="initLoading">
          <CircularProgress disableShrink={loadingPage} />
        </div>
      ) : (<>
        {supplier.validatedPetro === 'concluido' || supplier.userPetro ? ( 
            <>
              <CssBaseline />
              <Box sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
                <Header />
                {loadingPage ? (
                  <div className="initLoading">
                    <CircularProgress disableShrink={loadingPage} />
                  </div>
                ) : (
                  <>
                    <Routes>
                      <Route path='/index.html' element={
                        supplier.userPetro?<Report />:<MaterialManagementPlatform />
                      } />
                      <Route path='/TecInfo' element={<TecInfo />} />
                      <Route path='/ValidarDadosTec' element={<ValidarTecInfo />} />
                      <Route path='/Marketing' element={<Marketing />} />
                      <Route path='/Report' element={<Report />} />
                    </Routes>
                  </>)}
              </Box>
            </>
        ) : (
          <TelaErroPermissao />
        )}
      </>
      )}
    </ThemeProvider>
  )
}


export default App;
