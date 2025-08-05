import React, { useState } from "react";
import { Box, Typography, Grid, CircularProgress } from '@mui/material'
import { useDashboard } from '../../../useContext';
import Head from '../../../components/head';
import Master from './MasterDetail/Master';
import Detail from './MasterDetail/Detail';


const ValidarTecInfo = () => {
  const { selectedMaterials, loadingPage } = useDashboard();

  return (
    <Box sx={{ flexGrow: 1 }} className='bodyPage'>
      <Head title="Validar Dados Materiais - Gfex" description="Validar Informações Técnicas" />
      <Grid container style={{ paddingTop: '20px' }}>
        <Grid item size={12}>
          <Box>
            <Typography component="div" sx={{ color: 'rgb(0,142,145)', textAlign: 'left' }}>
              Validar Informações Técnicas ({selectedMaterials.length})
            </Typography>
          </Box>
        </Grid>
        <>
          {loadingPage ? (
            <Grid container size={12} sx={{ padding: '5px', justifyContent: 'center' }}>
              <div className="initLoading">
                <CircularProgress disableShrink={loadingPage} />
              </div>
            </Grid>
          ) : (
            <Grid container size={12} sx={{ padding: '5px' }}>
              <Grid item size={3.5} >
                <Master items={selectedMaterials} />
              </Grid>
              <Grid item size={8.5} >
                <Detail />
              </Grid>
            </Grid>
          )}</>
      </Grid>
    </Box>

  );
}

export default ValidarTecInfo;