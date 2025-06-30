import * as React from 'react';
import { AppBar, Box, Toolbar,Grid } from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";
import logopetrobras from '../../assets/logopetrobras.png';
import logoGFEX from '../../assets/logoGFEX.png';
import logoSimpleGfex from '../../assets/logoSimpleGfex.png';
import BasicMenu from './navigation';
import "./styles.css";
 
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* <Box  position="static" sx={{
        backgroundColor: 'rgb(255, 255, 255)'
      }}> */}
        <Grid  
        sx={{ 
         backgroundColor: 'rgb(255, 255, 255)' }}>
        <Grid container className={location.pathname.includes("/index.html") ? "homeHeader":"simpleHeader"}>
          {location.pathname.includes("/index.html") ? (
             <div > <img src={logoGFEX} />
              </div>):
              <div > 
           <img src={logoSimpleGfex} />
           </div>
          }
           
         
          <div className="" style={{alignContent:'center'}}>
            <img src={logopetrobras} style={{ height: '30px' }} />
          </div>
          </Grid>
        </Grid>
      {/* </Box> */}
      <div style={{height:'1px', backgroundColor:'rgba(84, 84, 84, 0.1)',
         marginLeft:'1%', marginRight:'2%'}}>
      </div>
      <AppBar  elevation={0} position="static" sx={{
        
        backgroundColor: 'rgb(255, 255, 255)',
        textAlign:'left',
        boxShadow:'17px 15px 11px -18px #111'
      }}>
        <BasicMenu />
      </AppBar>
    </Box>
  );
}