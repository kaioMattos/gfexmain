import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Box, Grid } from '@mui/material';
import { Button } from 'primereact/button';
import Head from 'components/head';
import IndicatorTechInfo from './indicators/TechInfo';
import { getCountIndicator, getTableData } from "api";
import { useDashboard } from 'useContext';
import TableInfo from 'components/table/TableInfo';
import { _assembleOrFilterGeneric } from 'utils';
import { LuSearchCheck } from "react-icons/lu";
import Highlight from 'components/Highlight';
import { useNavigate } from 'react-router-dom';
import "./styles.css";

const PAGE_SIZE = 200000;

const TecInfo = () => {
  
  const loadData = async () => {
    setMaterials([]);
    try {
      setLoadingPage(true);
      if (supplier !== undefined) {

        const sFiltersClasses = _assembleOrFilterGeneric(supplier, 'classDesc', 'class', 'class');
        const sFiltersManufactureres = _assembleOrFilterGeneric(supplier, 'mfrnr', 'manufacturer', 'text');
        const sFilter = `fornecedorInex eq '10097577'and (${sFiltersClasses}) and (${sFiltersManufactureres})`
        const countRecog = await getCountIndicator({
          $filter: `${sFilter} and NmReconhecido eq 'Comercializo'`
        });
        const countNotIdentify = await getCountIndicator({
          $filter: `${sFilter} and (NmReconhecido ne 'Não Comercializo' and NmReconhecido ne 'Comercializo')`
        });
        const countTecInfo = await getCountIndicator({
          $filter: `${sFilter} and InformacoesTecnicas eq 'validada'`
        });
        const countTecInfoNeedToFill = await getCountIndicator({
          $filter: `${sFilter} and InformacoesTecnicas eq 'Validar'`
        });
        setCountIndicators({
          recog: countRecog,
          tecInfo: countTecInfo,
          tecInfoFill: countTecInfoNeedToFill,
          notIdentify: countNotIdentify
        });

        const _items = await getTableData({
          $top: PAGE_SIZE,
          $filter: `${sFilter} and NmReconhecido eq 'Comercializo'`
        });
        const itemsWithIds = _items.map((item, index) => {
          item.id = index;
          return item;
        });
        setMaterials(itemsWithIds);

      }
    } finally {
      setLoadingPage(false);
    }
  }
  const navigate = useNavigate();
  const { supplier, setLoadingPage, loadingPage } = useDashboard();
  const [countIndicators, setCountIndicators] = useState({
    recog: 0,
    tecInfo: 0,
    tecInfoFill: 0,
    notIdentify: 0
  });
  const [materials, setMaterials] = useState(null);

  const GridHeaderTable = () => (
   
    <Grid>
      <Button style={{ marginLeft: '10px' }} label="Validar" 
      onClick={() => navigate('/gfexmain/ValidarDadosTec')}
      icon={<LuSearchCheck size={20} />} outlined severity="info" aria-label="Search" />
    </Grid>
  );
  useEffect(() => {
    loadData();
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
          <TableInfo materials={materials} loading={loadingPage} loadData={loadData}
          sActionHeader='validar Informações Técnicas'
           HeaderTable={<GridHeaderTable/>}/>
        </>)}</>
  );
};

export default TecInfo;
