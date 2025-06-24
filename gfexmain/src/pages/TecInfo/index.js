import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Box, Grid } from '@mui/material';
import { Button } from 'primereact/button';
import Head from '../../components/head';
import IndicatorTechInfo from './indicators/TechInfo';
import { useDashboard } from '../../useContext';
import TableInfo from '../../components/table/TableInfo';
import { _assembleOrFilterGeneric } from '../../utils';
import { LuSearchCheck } from "react-icons/lu";
import Highlight from '../../components/Highlight';
import { useNavigate } from 'react-router-dom';
import "./styles.css";

const PAGE_SIZE = 200000;

const TecInfo = () => {
  
  
  const navigate = useNavigate();
  const { loadingPage, countIndicators, materials } = useDashboard();
  

  const GridHeaderTable = () => (
   
    <Grid>
      <Button style={{ marginLeft: '10px' }} label="Validar" 
      onClick={() => navigate('/gfexmain/ValidarDadosTec')}
      icon={<LuSearchCheck size={20} />} outlined severity="info" aria-label="Search" />
    </Grid>
  );
  useEffect(() => {
    // loadData();
  }, []);

  return (
    <>
      <Head title="Informações Técnicas - Gfex" description="Informações Técnicas" />
      {loadingPage ? (
        <div className="initLoading">
          <CircularProgress disableShrink={loadingPage} />
        </div>
      ) : (
       <>
          <Grid container>
            <Box sx={{ paddingTop: '5px' }}>
              <Typography variant='subtitle1' sx={{ color: 'rgb(0,142,145)', textAlign: 'left'}}>              
                Olá EMERSON,
              </Typography>
              <Typography sx={{ color: 'rgb(0,142,145)', textAlign: 'left' }}>
                Materiais comercializados <Highlight className="destTotalMat">{countIndicators.recog}</Highlight>.
              </Typography>
            </Box>
          </Grid>
          <Grid sx={{ textAlign: 'center', marginTop: '1.5%' }}>

            <Grid container spacing={3} style={{ marginTop: '1.5%' }}>
              <Grid item size={12} >
                <Grid style={{
                  backgroundColor: 'white',
                  padding: '1%',
                  borderRadius: '6px',
                  minHeight: '100%'
                }} >
                  <Grid item size={12}>
                    <Box>
                      <Typography sx={{ color: 'black', textAlign: 'left', padding: '8px' }}>
                        Informações Técnicas
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item size={12} style={{ borderTop: '3px solid rgb(0,142,145)', minHeight: '90%' }}>
                    <Grid style={{ padding: '1%' }}>
                      <IndicatorTechInfo approved={countIndicators.tecInfo} revision={countIndicators.tecInfo}
                        notIdentify={countIndicators.tecInfoFill} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <TableInfo materials={materials.filter(item=>(item.NmReconhecido === 'Comercializo'))} loading={loadingPage} 
          sActionHeader='validar Informações Técnicas'
           HeaderTable={<GridHeaderTable/>}/>
        </>)}</>
  );
};

export default TecInfo;
