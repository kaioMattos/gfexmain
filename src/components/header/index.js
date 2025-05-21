import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, CardHeader } from '@mui/material';
import logoPetro from '../../assets/PetroIcone.png';
import logopetrobras from '../../assets/logopetrobras.png';
import logoGFEX from '../../assets/logoGFEX.png';
import { LuUser } from "react-icons/lu";
import NavLink from '../breadcrumbs';

export default function Header({ totalMaterial }) {

  return (
    <Box sx={{ flexGrow: 1, marginLeft: '-35px', paddingInlineEnd: '2%', paddingBottom:'0.5%' }}>
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
      <AppBar elevation={0} position="static" sx={{
        paddingInline: '5%',
        backgroundColor: 'rgb(255, 255, 255)'
      }}>
        <NavLink />
      </AppBar>
      

    </Box>
  );
}