import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

import IndicatorCard from '../../components/dashboard/IndicatorCard';
import { PiMedalDuotone } from "react-icons/pi";
import { MdNotInterested, MdPriceCheck } from "react-icons/md";
import { IoNewspaperOutline } from "react-icons/io5";
import { getCountIndicator, getUserLogged, getUsersS4Data, getUserHana } from "../../api";

// ==============================|| INDICATORS ||============================== //
const _assembleFilterGeneric = (propFilter, value) => (` ${propFilter} eq '${value}'`);

const _assembleOrFilterGeneric =  (objHana, propOfilter, propObjHana) => {
  const aValues = JSON.parse(objHana[propObjHana]);
  const aFiltersValues = aValues.filter((item) => (item.status))
    .map((item) => (`${_assembleFilterGeneric(propOfilter, item[propObjHana])} or`));
    console.log(aFiltersValues)
  return aFiltersValues.join('').slice(0, -3);
};
const Indicators = () => {
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
          const countRecog = await getCountIndicator({
            $filter: `NmReconhecido eq 'SIM'${sFilter}`
          });
          const countNotRecog = await getCountIndicator({
            $filter: `NmReconhecido eq 'NÃO'${sFilter}`
          });
          const countPriceAta = await getCountIndicator({
            $filter: `AtaPrecoPreenchida eq 'SIM'${sFilter}`
          });
          const countTecInfo = await getCountIndicator({
            $filter: `InformacoesTecnicas eq 'SIM'${sFilter}`
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
    loadData(true);
  }, []);
  return (
    <Box sx={{ padding: '10px' }}>
      <Grid container spacing={3}>
        <Grid size={3} item >
          <IndicatorCard
            linkClick="https://devcfpb.launchpad.cfapps.br10.hana.ondemand.com/1ee5b575-1ffa-4017-8514-451331d4a4d5.gfexpetrobrasmaterialgfex.gfexpetrobrasmaterialgfex-0.0.4/index.html#/Products"
            title="Reconhecidos"
            total={countIndicators.recog}
            icon={<PiMedalDuotone color='white' size={40} />}
          />
        </Grid>
        <Grid size={3} item >
          <IndicatorCard
            linkClick="https://devcfpb.launchpad.cfapps.br10.hana.ondemand.com/1ee5b575-1ffa-4017-8514-451331d4a4d5.gfexpetrobrasmaterialgfex.gfexpetrobrasmaterialgfex-0.0.4/index.html#/Products/materialNotRecog"
            title="Não Reconhecidos"
            total={countIndicators.notRecog}
            icon={<MdNotInterested color='white' size={40} />}
          /></Grid>
        <Grid size={3} item >
          <IndicatorCard
            title="Ata de Preço Preenchida"
            total={countIndicators.priceATA}
            icon={<MdPriceCheck color='white' size={40} />}
          /></Grid>
        <Grid size={3} item >
          <IndicatorCard
            title="Informações Tecnicas"
            total={countIndicators.tecInfo}
            color="warning"
            icon={<IoNewspaperOutline color='white' size={40} />}
          /></Grid>
      </Grid>
    </Box>
  );
};

export default Indicators;
