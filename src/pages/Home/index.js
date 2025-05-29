import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Box, Grid } from '@mui/material';
import Head from 'components/head';
import IndicatorMkt from './indicators/Marketing';
import IndicatorTechInfo from './indicators/TechInfo';
import IndicatorContractMinute from './indicators/ContractualMinute';
import IndicatorPriceAta from './indicators/PriceAta';
import { getCountIndicator, getTableData } from "api";
import { useDashboard } from 'useContext';
import MainTableMaterial from 'components/table/TableHome';
import { _assembleOrFilterGeneric } from 'utils';
import "./styles.css";

const PAGE_SIZE = 200000;

const Home = () => {
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
        const countNotRecog = await getCountIndicator({
          $filter: `${sFilter} and NmReconhecido eq 'Não Comercializo'`
        });
        const countNotIdentify = await getCountIndicator({
          $filter: `${sFilter} and (NmReconhecido ne 'Não Comercializo' and NmReconhecido ne 'Comercializo')`
        });

        const countPriceAta = await getCountIndicator({
          $filter: `${sFilter} and AtaPrecoPreenchida eq 'Preenchido' and NmReconhecido eq 'Comercializo'`
        });

        const countPriceAtaNeedToFill = await getCountIndicator({
          $filter: `${sFilter} and AtaPrecoPreenchida eq 'Preencher' and NmReconhecido eq 'Comercializo'`
        });
        const countTecInfo = await getCountIndicator({
          $filter: `${sFilter} and InformacoesTecnicas eq 'validada'`
        });
        const countTecInfoNeedToFill = await getCountIndicator({
          $filter: `${sFilter} and InformacoesTecnicas eq 'Validar'`
        });
        setCountIndicators({
          recog: countRecog,
          notRecog: countNotRecog,
          priceATA: countPriceAta,
          priceATAFill: countPriceAtaNeedToFill,
          tecInfo: countTecInfo,
          tecInfoFill: countTecInfoNeedToFill,
          notIdentify: countNotIdentify
        });

        const _items = await getTableData({
          $top: PAGE_SIZE,
          $filter: sFilter
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

  const { supplier, setLoadingPage, loadingPage } = useDashboard();
  const [countIndicators, setCountIndicators] = useState({
    recog: 0,
    notRecog: 0,
    priceATA: 0,
    priceATAFill: 0,
    tecInfo: 0,
    tecInfoFill: 0,
    notIdentify: 0
  });
  const [materials, setMaterials] = useState(null);
  const Highlight = ({ children, className }) => (
    <span className={className}>
      {children}
    </span>
  );
  useEffect(() => {
    loadData();
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
                Materiais encontrados <Highlight className="destTotalMat">{countIndicators.recog + countIndicators.notRecog + countIndicators.notIdentify}</Highlight>.
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
                      <IndicatorMkt recog={countIndicators.recog} notRecog={countIndicators.notRecog}
                        notIdentify={countIndicators.notIdentify} />
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
                      <IndicatorContractMinute agree={countIndicators.tecInfo} notAgree={countIndicators.tecInfo} notIdentify={countIndicators.tecInfo} />
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
                      <IndicatorTechInfo approved={countIndicators.tecInfo} revision={countIndicators.tecInfo}
                        notIdentify={countIndicators.tecInfoFill} />
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
                      <IndicatorPriceAta filled={countIndicators.priceATA} notIdentify={countIndicators.priceATAFill} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <MainTableMaterial materials={materials} loading={loadingPage} loadData={loadData} />
        </>)}</>
  );
};

export default Home;
