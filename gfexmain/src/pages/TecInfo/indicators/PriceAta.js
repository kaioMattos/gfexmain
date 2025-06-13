import React from "react";
import { Grid, Box } from '@mui/material';
import { BsCardChecklist } from "react-icons/bs";
import { GrDocumentTime } from "react-icons/gr";
import IndicatorCard from '../../../components/indicator/IndicatorCard';

const IndicatorPriceAta = ({ filled, notIdentify }) => {
  return (
    <Box sx={{ padding: '10px' }}>
      <Grid container spacing={3} >
        <Grid size={6} item >
          <IndicatorCard
            title="Preenchida"
            total={filled}
            icon={<BsCardChecklist size={35} />}
          />
        </Grid>

        <Grid size={6} item >
          <IndicatorCard
            title="Aguardando avaliação"
            total={notIdentify}
            icon={<GrDocumentTime size={35} />}
          /></Grid>

      </Grid>
    </Box>
  );
};
export default IndicatorPriceAta;
