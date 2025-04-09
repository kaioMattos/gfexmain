import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, CardHeader } from '@mui/material';
import logoPetro from '../../assets/PetroIcone.png';
import logopetrobras from '../../assets/logopetrobras.png';
import logoGFEX from '../../assets/logoGFEX.png';
import { LuUser } from "react-icons/lu";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1, marginLeft: '-35px', paddingInlineEnd:'2%' }}>
      <AppBar elevation={0} position="static" sx={{
        backgroundColor: 'rgb(255, 255, 255)'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <div >
        <img src={logoGFEX} style={{height: '130px'}}/>
        </div>
          <div className="">
            <img src={logopetrobras} style={{height: '40px'}} />
          </div>
        </Toolbar>

      </AppBar>
      <AppBar elevation={0} position="static" sx={{ paddingInline:'2%', height: '40px', backgroundColor: 'rgb(255, 255, 255)' }}>
        <Box sx={{ paddingLeft: '45px', paddingTop: '5px' }}>
          <Typography variant='subtitle1' sx={{ color: 'rgb(0,142,145)', fontWeight: 'bold', textAlign: 'left', marginLeft: '10px' }}>
            <LuUser size={30} sx={{ color: 'rgb(0,142,145)' }} />
            EMERSON - 03680252000105
          </Typography>
        </Box>
      </AppBar>
    </Box>
  );
}