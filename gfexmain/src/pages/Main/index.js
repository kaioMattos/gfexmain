import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Box, Grid } from '@mui/material';
import Head from '../../components/head';
import IndicatorMkt from './indicators/Marketing';
import IndicatorTechInfo from './indicators/TechInfo';
import IndicatorContractMinute from './indicators/ContractualMinute';
import IndicatorPriceAta from './indicators/PriceAta';
import { useDashboard } from '../../useContext';
import MainTableMaterial from '../../components/table/TableHome';

import "./styles.css";

const Home = () => {
  const { loadingPage, countIndicators, materials, loadData } = useDashboard();

  const Highlight = ({ children, className }) => (
    <span className={className}>
      {children}
    </span>
  );
  useEffect(() => {
    // loadData();
  }, []);

  return (
    <>
      <Head title="Gfex" description="Página principal" />
      {loadingPage ? (
        <div className="initLoading">
          <CircularProgress disableShrink={loadingPage} />
        </div>
      ) : (
        <>
          <Grid container>
            <Box sx={{ paddingTop: '5px' }}>
              <Typography variant='subtitle1' sx={{ color: 'rgb(0,142,145)', textAlign: 'left' }}>
                {/* <LuUser size={30} sx={{ color: 'rgb(0,142,145)' }} /> */}
                Olá EMERSON,
              </Typography>


              <Typography sx={{ color: 'rgb(0,142,145)', textAlign: 'left' }}>
                Materiais encontrados <Highlight className="destTotalMat">{countIndicators.comercializacao.total}</Highlight>.

              </Typography>
              {/* <Typography sx={{ color: 'rgb(0,142,145)', textAlign: 'left', marginLeft: '10px', paddingTop:'0.8%' }}>        
            Principais funcionalidades do GFEX:
          </Typography> */}
            </Box>
          </Grid>
          <Grid sx={{ textAlign: 'center', marginTop: '1.5%' }}>
            <Grid container spacing={3} >
              <Grid item size={6} >
                <Grid style={{
                  backgroundColor: 'white',
                  padding: '1%',
                  borderRadius: '6px',
                  minHeight: '100%'
                }} >
                  <Grid item size={12}>
                    <Box>
                      <Typography sx={{ color: 'black', textAlign: 'left', padding: '8px' }}>
                        Comercialização
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item size={12} style={{ borderTop: '3px solid rgb(0,142,145)', minHeight: '90%' }}>
                    <Grid style={{ padding: '1%' }}>
                      <IndicatorMkt recog={countIndicators.comercializacao.recog} notRecog={countIndicators.comercializacao.notRecog}
                        notIdentify={countIndicators.comercializacao.notIdentify} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item size={6} >
                <Grid style={{
                  backgroundColor: 'white',
                  padding: '1%',
                  borderRadius: '6px',
                  minHeight: '100%'
                }} >
                  <Grid item size={12}>
                    <Box>
                      <Typography sx={{ color: 'black', textAlign: 'left', padding: '8px' }}>
                        Minuta Contratual
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item size={12} style={{ borderTop: '3px solid rgb(0,142,145)', minHeight: '90%' }}>
                    <Grid style={{ padding: '1%' }}>
                      <IndicatorContractMinute agree={countIndicators.minutaContratual.agree} notAgree={countIndicators.minutaContratual.notAgree} notIdentify={countIndicators.minutaContratual.notIdentify} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ marginTop: '1.5%' }}>
              <Grid item size={8} >
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
                      <IndicatorTechInfo approved={countIndicators.informacoesTecnicas.approved} revision={countIndicators.informacoesTecnicas.awaitApproval}
                        notIdentify={countIndicators.informacoesTecnicas.notIdentify} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item size={4} >
                <Grid style={{
                  backgroundColor: 'white',
                  padding: '1%',
                  borderRadius: '6px',
                  minHeight: '100%'
                }} >
                  <Grid item size={12}>
                    <Box>
                      <Typography sx={{ color: 'black', textAlign: 'left', padding: '8px' }}>
                        Ata de Preço
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item size={12} style={{ borderTop: '3px solid rgb(0,142,145)', minHeight: '90%' }}>
                    <Grid style={{ padding: '1%' }}>
                      <IndicatorPriceAta filled={countIndicators.ataPreco.filled} notIdentify={countIndicators.ataPreco.notFilled} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <MainTableMaterial materials={materials} loading={loadingPage} loadData={loadData} />
        </>
      )}
    </>
  );
};

export default Home;
