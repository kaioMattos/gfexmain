import React from "react";
import "./App.css";

import "./fonts/PetrobrasSans/PetrobrasSans_Rg.ttf";
import NotFound from "pages/NotFound";
import AppBar from "components/AppBar";
import MasterPage from "pages/MasterPage";
import Indicators from './routes/dashboard'
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
