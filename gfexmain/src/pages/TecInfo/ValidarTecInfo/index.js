import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from '@mui/material'
import { useDashboard } from 'useContext';
import Head from 'components/head';
import Master from './MasterDetail/Master';
import Detail from './MasterDetail/Detail';


const ValidarTecInfo = () =>{
  const { selectedMaterials } = useDashboard();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Head title="Validar Dados Materiais - Gfex" description="Validar Informações Técnicas" />
      <Grid container spacing={2} style={{ paddingTop: '20px' }}>
        <Grid item size={12}>
          <Box>
            <Typography component="div" sx={{ color: 'rgb(0,142,145)', textAlign: 'left' }}>
              Validar Informações Técnicas ({selectedMaterials.length})
            </Typography>
          </Box>
        </Grid>
        {/* <Grid style={{ padding: '5px' }}> */}
          <Grid item size={4} >
            <Master items={selectedMaterials}/>
          </Grid>
          <Grid item size={8} >           
           <Detail/>
          </Grid>
        {/* </Grid> */}
      </Grid>
    </Box>
  );
}

export default ValidarTecInfo;