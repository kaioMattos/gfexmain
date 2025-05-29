import * as React from 'react';
import { AppBar, Box, Toolbar } from '@mui/material';
import logopetrobras from '../../assets/logopetrobras.png';
import logoGFEX from '../../assets/logoGFEX.png';
import BasicMenu from './navigation'

export default function Header() {

  return (
    <Box sx={{ flexGrow: 1, marginLeft: '-35px', paddingBottom:'0.5%' }}>
      <AppBar elevation={0} position="static" sx={{
        backgroundColor: 'rgb(255, 255, 255)'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <div >
            <img src={logoGFEX} style={{ height: '130px' }} />
          </div>
          <div className="">
            <img src={logopetrobras} style={{ height: '40px' }} />
          </div>
        </Toolbar>

      </AppBar>
      <div style={{height:'1px', backgroundColor:'rgba(84, 84, 84, 0.1)',
         marginLeft:'3%', marginRight:'1%'}}>
      </div>
      <AppBar  elevation={0} position="static" sx={{
        paddingInline: '4%',
        backgroundColor: 'rgb(255, 255, 255)',
        textAlign:'left',
        boxShadow:'17px 15px 11px -18px #111'
      }}>
        <BasicMenu />
      </AppBar>
    </Box>
  );
}