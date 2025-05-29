import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';
import './index.css';
import './flags.css';
import { DashboardContextProvider } from './useContext';
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import  MainRoutes from './routes';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <React.StrictMode>
    <DashboardContextProvider>
      <MainRoutes />
    </DashboardContextProvider>
  </React.StrictMode>
  </BrowserRouter>
);


reportWebVitals();
