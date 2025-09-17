import { Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getUserLogged } from "./api";
import { useDashboard } from './useContext';
import { useAuth } from './useContext/AuthContext';
import Header from './components/Header'
import Marketing from './pages/Marketing';
import Report from './pages/Report'
import TelaErroPermissao from './pages/NotPermission';
import "./App.css";
import theme from './StylesTheme';
import { CssBaseline, Box, CircularProgress } from "@mui/material";
import Home from './pages/Home';
import TecInfoPage from './pages/TecInfo';
import PrivateRoute from './components/Route/PrivateRoute';
import mockUserPetro from './mock/userPetro/userByCAP.json'
import mockUserSupplier from './mock/userSupplier/TesteBoxfile/userByCAP.json'
import mockUserSupplierNotFounded from './mock/userSupplier/TesteBoxfile/userByCAPNotFounded.json'

const App = () => {

  const loadInitData = async (isFirstLoad) => {
    setLoadPage(true);
    // const resultUser = await getUserLogged();
    const resultUser = mockUserSupplierNotFounded;
    const user = JSON.parse(resultUser.value);
    try {
      if (isFirstLoad) {
        await login(user);
        await setSupplierContext(user);
      }
    } finally {
      setLoadPage(false);
    }
  }
  useEffect(() => {
    loadInitData(true);
  }, []);

  const { supplier, setSupplierContext, loadingPage, setLoadingPage, loadData } = useDashboard();
  const { login } = useAuth();
  const [laodPage, setLoadPage] = useState(true)
  // useEffect(() => {
  //   loadData();
  // }, []);

  return (
    <ThemeProvider theme={theme}>
      {laodPage ? (
        <div className="initLoading">
          <CircularProgress disableShrink={laodPage} />
        </div>
      ) : (<>
        {/* {supplier.validatedPetro === 'concluido' || supplier.userPetro ? ( */}
          <>
            {/* <CssBaseline /> */}
            <Box sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
              {/* <Header /> */}
                  <Routes>
                    <Route
                      path="/index.html"
                      element={
                        <PrivateRoute element={<Home/>} allowedProfiles={['fornecedor']} />
                      }
                    />
                     <Route
                      path="/Marketing"
                      element={
                        <PrivateRoute element={<Marketing/>} allowedProfiles={['fornecedor']} />
                      }
                    />
                     <Route
                      path="/TecInfo"
                      element={
                        <PrivateRoute element={<TecInfoPage/>} allowedProfiles={['fornecedor']} />
                      }
                    />
                     <Route
                      path="/Report"
                      element={
                        <PrivateRoute element={<Report/>} allowedProfiles={['petrobras']} />
                      }
                    />
                    <Route
                      path="/cadastro"
                      element={
                        <TelaErroPermissao />
                      }
                    />
                  </Routes>
                
            </Box>
          </>
        {/* ) : (
          <TelaErroPermissao />
        )} */}
      </>
      )}
    </ThemeProvider>
  )
}

export default App;
