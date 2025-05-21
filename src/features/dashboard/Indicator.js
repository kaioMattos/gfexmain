import React from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import IndicatorCard from '../../components/dashboard/IndicatorCard';
import { PiMedalDuotone } from "react-icons/pi";
import { MdNotInterested, MdPriceCheck } from "react-icons/md";
import { IoNewspaperOutline } from "react-icons/io5";

const Indicators = ({recog, notRecog, priceATA, tecInfo}) => {
  return (
    <Box sx={{ padding: '10px' }}>
      <Grid container spacing={3}>
        <Grid size={4} item >
          <IndicatorCard
            linkClick="https://devcfpb.launchpad.cfapps.br10.hana.ondemand.com/1ee5b575-1ffa-4017-8514-451331d4a4d5.gfexpetrobrasmaterialgfex.gfexpetrobrasmaterialgfex-0.0.5/index.html#/Products"
            title="Comercializados"
            total={recog}
            icon={<PiMedalDuotone style={{color: 'rgb(0,133,66)'}} size={40} />}
          />
        </Grid>
        <Grid size={4} item >
          <IndicatorCard
            linkClick="https://devcfpb.launchpad.cfapps.br10.hana.ondemand.com/1ee5b575-1ffa-4017-8514-451331d4a4d5.gfexpetrobrasmaterialgfex.gfexpetrobrasmaterialgfex-0.0.5/index.html#/Products/materialNotRecog"
            title="Não Comercializados"
            total={notRecog}
            icon={<MdNotInterested style={{color: 'rgb(0,133,66)'}} size={40} />}
          /></Grid>
        <Grid size={4} item >
          <IndicatorCard
            title="Ata de Preço Preenchida"
            total={priceATA}
            icon={<MdPriceCheck style={{color: 'rgb(0,133,66)'}} size={40} />}
          /></Grid>
        
      </Grid>
    </Box>
  );
};
export default Indicators;
