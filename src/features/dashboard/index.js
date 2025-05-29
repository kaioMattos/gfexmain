import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Box, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import IndicatorMkt from '../indicator/Marketing';
import IndicatorTechInfo from '../indicator/TechInfo';
import IndicatorContractMinute from '../indicator/ContractualMinute';
import IndicatorPriceAta from '../indicator/PriceAta';
import { getCountIndicator, getTableData } from "api";
import { useDashboard } from '../../useContext';
import MainTableMaterial from "../../components/table/TableHome";
import { _assembleOrFilterGeneric } from '../../utils';
import Header from '../../components/header';

import "../../App.css";
// import "./fonts/PetrobrasSans/PetrobrasSans_Rg.ttf";
const useStyles = makeStyles((theme) => ({

  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0px 15px 15px 0px'
  },
  button: {
    backgroundColor: 'rgb(0,142,145)',
    color: '#fff',
    // marginTop: theme.spacing(3),
    marginLeft: '1rem',
    // padding: '8px',
    borderRadius: '6px',
    '&:hover': {
      backgroundColor: 'rgb(0, 98, 152)',

    },
  },
  buttonAdd: {
    backgroundColor: 'rgb(138,35,135)',
    background: 'rgb(135, 88, 255)',
    color: 'rgb(255, 255, 255)',
    border: 'none',
    cursor: 'pointer',
  }
}))


const PAGE_SIZE = 200000;

const Dashboard = () => {
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
          tecInfoFill:countTecInfoNeedToFill,
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
    tecInfoFill:0,
    notIdentify: 0
  });
  const [materials, setMaterials] = useState(null);
  const classes = useStyles();
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

      <Header totalMaterial={countIndicators.recog + countIndicators.notRecog + countIndicators.notIdentify} />
      {loadingPage ? (
        <div className="initLoading">
          <CircularProgress disableShrink={loadingPage} />
        </div>
      ) : (
        <div className="body">
          <Grid container>
            <Box sx={{ paddingTop: '5px' }}>
              <Typography variant='subtitle1' sx={{ color: 'rgb(0,142,145)', textAlign: 'left', marginLeft: '10px' }}>
                {/* <LuUser size={30} sx={{ color: 'rgb(0,142,145)' }} /> */}
                Olá EMERSON,
              </Typography>


              <Typography sx={{ color: 'rgb(0,142,145)', textAlign: 'left', marginLeft: '10px' }}>
                Materiais encontrados <Highlight className="destTotalMat">{countIndicators.recog + countIndicators.notRecog + countIndicators.notIdentify}</Highlight>.
              </Typography>
              {/* <Typography sx={{ color: 'rgb(0,142,145)', textAlign: 'left', marginLeft: '10px', paddingTop:'0.8%' }}>        
            Principais funcionalidades do GFEX:
          </Typography> */}
            </Box>
          </Grid>
          
          <Grid container spacing={3} style={{ marginTop: '0.5%' }}>
            <Grid item size={6} >
              <Grid style={{
                backgroundColor: 'white',
                padding: '1%',
                borderRadius: '6px',
                minHeight:'100%'
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
                minHeight:'100%'
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
                minHeight:'100%'
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
                minHeight:'100%'
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
          
          <MainTableMaterial materials={materials} loading={loadingPage} loadData={loadData} />
        </div>)}</>
  );
};

export default Dashboard;
