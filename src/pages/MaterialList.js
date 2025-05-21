import React, { useEffect, useState } from "react";
import { Container, Box } from "@material-ui/core";
import MainTableMaterial from "../components/table/mainTableMaterial";
import { PrimeReactProvider } from 'primereact/api';
import { Typography } from '@mui/material';

import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import '../index.css';
import '../flags.css';

export default function MaterialList() {

  return (
    <Container disableGutters style={{padding:'10px'}}>
      <Box height="80vh" py={5} >
      <Typography variant="h5" component="h6" sx={{textAlign:'left', paddingBottom:'1%', color:'#4d4d4d'}}>
        Lista de Materiais
      </Typography>
        <PrimeReactProvider> <MainTableMaterial/></PrimeReactProvider>
      </Box>
    </Container>
  );
}


