import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, CardHeader } from '@mui/material';
import logo from '../../assets/PetroIcone.png';

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'rgb(255, 255, 255)' }}>
        <Toolbar>
          <CardHeader
            title={
              <Typography variant='h4' sx={{ fontWeight: 'bold', color: 'rgb(18, 80, 95)' }}>
                GFEX
              </Typography>
            }
            subheader={
              <Typography sx={{ color: 'rgb(18, 80, 95)' }}>
                Gestão de Fornecedores Exclusivos
              </Typography>
            } 
            sx={{ flexGrow: 1 }}
            align="left" />
          <div className="">
            <img src={logo} />
          </div>
        </Toolbar>

      </AppBar>
      <AppBar position="static" sx={{ height: '40px', backgroundColor: 'rgb(48, 142, 166)', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', }}>
     <Box  sx={{  paddingLeft:'45px', paddingTop:'5px'}}>
      <Typography variant='subtitle1' sx={{ fontWeight: 'bold', textAlign: 'left', marginLeft:'10px' }}>
          EMERSON
        </Typography>
        </Box>


      </AppBar>
    </Box>
  );
}