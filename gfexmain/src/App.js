import { Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getUserLogged } from "./api";
import { useAuth } from './useContext/AuthContext';
import Marketing from './pages/Marketing';
import Report from './pages/Report'
import AccessRequest from './pages/AccessRequest';
import "./App.css";
import theme from './StylesTheme';
import { Box, CircularProgress } from "@mui/material";
import Home from './pages/Home';
import TecInfoPage from './pages/TecInfo';
import PrivateRoute from './components/Route/PrivateRoute';
import mockUserPetro from './mock/userPetro/userByCAP.json'
import mockUserSupplier from './mock/userSupplier/TesteBoxfile/userByCAP.json'
import mockUserSupplierNotFounded from './mock/userSupplier/TesteBoxfile/userByCAPNotFounded.json'
import { AcessRequestProvider } from './useContext/AccessCtx';

const App = () => {

  const loadInitData = async (isFirstLoad) => {
    setLoadPage(true);
    //const resultUser = await getUserLogged();
    const resultUser = mockUserSupplier;
    const user = JSON.parse(resultUser.value);

    try {
      if (isFirstLoad) {
        await login(user);
      }
    } finally {
      setLoadPage(false);
    }
  }
  useEffect(() => {
    loadInitData(true);
  }, []);

  const { login } = useAuth();
  const [laodPage, setLoadPage] = useState(true)

  return (
    <ThemeProvider theme={theme}>
      {laodPage ? (
        <div className="initLoading">
          <CircularProgress disableShrink={laodPage} />
        </div>
      ) : (
        <>
          <Box sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
            <Routes>
              <Route
                path="/index.html"
                element={
                  <PrivateRoute element={<Home />} allowedProfiles={['fornecedor']} />
                }
              />
              <Route
                path="/Marketing"
                element={
                  <PrivateRoute element={<Marketing />} allowedProfiles={['fornecedor']} />
                }
              />
              <Route
                path="/TecInfo"
                element={
                  <PrivateRoute element={<TecInfoPage />} allowedProfiles={['fornecedor']} />
                }
              />
              <Route
                path="/Report"
                element={
                  <Report />
                }
              />
              <Route
                path="/cadastro"
                element={
                  <AcessRequestProvider><AccessRequest /></AcessRequestProvider>
                }
              />
            </Routes>
          </Box>
        </>
      )}
    </ThemeProvider>
  )
}

export default App;
