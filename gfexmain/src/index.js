import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';
import './index.css';
import './flags.css';
import { DashboardContextProvider } from './useContext';
import { AuthProvider } from './useContext/AuthContext';

// import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import App from './App';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <React.StrictMode>
      <AuthProvider>
        <DashboardContextProvider>
          <App />
        </DashboardContextProvider>
      </AuthProvider>
    </React.StrictMode>
  </BrowserRouter>
);


reportWebVitals();
