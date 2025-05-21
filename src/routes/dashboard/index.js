import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import IndicatorCard from '../../components/dashboard/IndicatorCard';
import { PiMedalDuotone } from "react-icons/pi";
import { MdNotInterested, MdPriceCheck } from "react-icons/md";
import { IoNewspaperOutline } from "react-icons/io5";
import { getCountIndicator, getUserLogged, getUsersS4Data, getUserHana } from "../../api";
import { _assembleFilterGeneric, _assembleOrFilterGeneric } from '../../utils';


// ==============================|| INDICATORS ||============================== //

const Indicators = ({recog, notRecog, priceATA, tecInfo}) => {
  const [countIndicators, setCountIndicators] = useState({
    recog: 0,
    notRecog: 0,
    priceATA:0,
    tecInfo:0
  });
  const [loading, setLoading] = useState(false);
  const loadData = async (isFirstLoad) => {
      try {
        // setItems([]);
        setLoading(true);
  
        // if (isFirstLoad) {
          // const user = await getUserLogged();
          // const usersS4 = await getUsersS4Data();
          const usersS4 = await getUserHana({$filter: `documentId eq '03680252000105'`});
          const sFiltersClasses = _assembleOrFilterGeneric(usersS4,'classDesc', 'class');
          const sFiltersManufactureres = _assembleOrFilterGeneric(usersS4,'mfrnr', 'manufacturer');
          const sFilter = ` and fornecedorInex eq '10097577'and (${sFiltersClasses}) and (${sFiltersManufactureres})`
          // const sFilter = ` and fornecedorInex eq '10097577'`
          const countRecog = await getCountIndicator({
            $filter: `NmReconhecido eq 'Comercializo'${sFilter}`
          });
          const countNotRecog = await getCountIndicator({
            $filter: `NmReconhecido eq 'Não Comercializo'${sFilter}`
          });
          const countPriceAta = await getCountIndicator({
            $filter: `AtaPrecoPreenchida eq 'true'${sFilter}`
          });
          const countTecInfo = await getCountIndicator({
            $filter: `InformacoesTecnicas eq 'true'${sFilter}`
          });
          setCountIndicators({
            recog:countRecog,
            notRecog:countNotRecog,
            priceATA:countPriceAta,
            tecInfo:countTecInfo
          })
        // }
        
       
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    // when component mounted
    // loadData(true);
  }, []);
  return (
    <Box sx={{ padding: '10px' }}>
      <Grid container spacing={3}>
        <Grid size={3} item >
          <IndicatorCard
            linkClick="https://devcfpb.launchpad.cfapps.br10.hana.ondemand.com/1ee5b575-1ffa-4017-8514-451331d4a4d5.gfexpetrobrasmaterialgfex.gfexpetrobrasmaterialgfex-0.0.5/index.html#/Products"
            title="Comercializados"
            total={recog}
            icon={<PiMedalDuotone style={{color: 'rgb(0,133,66)'}} size={40} />}
          />
        </Grid>
        <Grid size={3} item >
          <IndicatorCard
            linkClick="https://devcfpb.launchpad.cfapps.br10.hana.ondemand.com/1ee5b575-1ffa-4017-8514-451331d4a4d5.gfexpetrobrasmaterialgfex.gfexpetrobrasmaterialgfex-0.0.5/index.html#/Products/materialNotRecog"
            title="Não Comercializados"
            total={notRecog}
            icon={<MdNotInterested style={{color: 'rgb(0,133,66)'}} size={40} />}
          /></Grid>
        <Grid size={3} item >
          <IndicatorCard
            title="Ata de Preço Preenchida"
            total={priceATA}
            icon={<MdPriceCheck style={{color: 'rgb(0,133,66)'}} size={40} />}
          /></Grid>
        <Grid size={3} item >
          <IndicatorCard
          linkClick="https://devcfpb.launchpad.cfapps.br10.hana.ondemand.com/a730eef0-e757-4cf3-85ea-548427d39a43.tecnicalinfogfex.tecnicalinfogfex-0.0.1/index.html"
            title="Informações Técnicas Validadas"
            total={tecInfo}
            color="warning"
            icon={<IoNewspaperOutline style={{color: 'rgb(0,133,66)'}} size={40} />}
          /></Grid>
      </Grid>
    </Box>
  );
};

export default Indicators;
