import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getUserLogged } from "./api";
import { useDashboard } from './useContext';
import Header from './components/Header'
import Marketing from './pages/Marketing';
import Report from './pages/Report'
import TelaErroPermissao from './pages/NotPermission';
import "./App.css";
import theme from './StylesTheme';
import { CssBaseline, Box, CircularProgress } from "@mui/material";
import HomePage from './pages/Home';
import TecInfoPage from './pages/TecInfo';
import mockUserPetro from './mock/userPetro/userByCAP.json'
import mockUserSupplier from './mock/userSupplier/TesteBoxfile/userByCAP.json'
const App = () => {

  const loadInitData = async (isFirstLoad) => {
    setLoadingPage(true);
    const resultUser = await getUserLogged();
    // const resultUserAriba = mockUserSupplier;
    const user = JSON.parse(resultUser.value);
    try {
      if (isFirstLoad) {
        await setSupplierContext(user);
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
                        supplier.userPetro?<Report />:<HomePage />
                      } />
                      <Route path='/TecInfo' element={<TecInfoPage />} />
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
