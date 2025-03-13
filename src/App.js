import React from "react";
import "./App.css";
import NotFound from "pages/NotFound";
import AppBar from "components/AppBar";
import MasterPage from "pages/MasterPage";
import Indicators from './routes/dashboard'
import logo from './assets/topAzulPiscina.png'
import { Card, Typography } from '@mui/material';
import Header from './components/header'
const App = () => {
  return (
    <div className="App">
      <Header/>
      <div className="body">
        <Indicators/>
        <MasterPage />
      </div>
    </div>
  );
};

export default App;
