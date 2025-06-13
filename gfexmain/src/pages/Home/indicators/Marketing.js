import React from "react";
import { Grid, Box } from '@mui/material';
import { PiMedalDuotone } from "react-icons/pi";
import { MdNotInterested } from "react-icons/md";
import { GrDocumentTime } from "react-icons/gr";
import IndicatorCard from '../../../components/indicator/IndicatorCard';

const IndicatorMkt = ({ recog, notRecog, notIdentify }) => {
  return (
    <Box sx={{ padding: '10px' }}>
      <Grid container spacing={3} >
        <Grid size={4} item >
          <IndicatorCard
            linkClick="https://devcfpb.launchpad.cfapps.br10.hana.ondemand.com/1ee5b575-1ffa-4017-8514-451331d4a4d5.gfexpetrobrasmaterialgfex.gfexpetrobrasmaterialgfex-0.0.5/index.html#/Products"
            title="Comercializados"
            total={recog}
            icon={<PiMedalDuotone size={35} />}
          />
        </Grid>
        <Grid size={4} item >
          <IndicatorCard
            linkClick="https://devcfpb.launchpad.cfapps.br10.hana.ondemand.com/1ee5b575-1ffa-4017-8514-451331d4a4d5.gfexpetrobrasmaterialgfex.gfexpetrobrasmaterialgfex-0.0.5/index.html#/Products/materialNotRecog"
            title="Não Comercializados"
            total={notRecog}
            icon={<MdNotInterested size={35} />}
          /></Grid>
        <Grid size={4} item >
          <IndicatorCard
            title="Aguardando avaliação"
            total={notIdentify}
            icon={<GrDocumentTime size={35} />}
          /></Grid>

      </Grid>
    </Box>
  );
};
export default IndicatorMkt;
