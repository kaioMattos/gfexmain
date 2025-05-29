import React from "react";
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import IndicatorCard from '../../components/indicator/IndicatorCard';
import { BsCardChecklist } from "react-icons/bs";
import { MdNotInterested, MdPriceCheck } from "react-icons/md";
import { GrDocumentTime } from "react-icons/gr";
const IndicatorPriceAta = ({filled, notIdentify}) => {
  return (
    <Box sx={{ padding: '10px' }}>
    <Grid container spacing={3} >
      <Grid size={6} item >
      <IndicatorCard
            title="Preenchida"
            total={filled}
            icon={<BsCardChecklist style={{color: 'rgb(0,133,66)'}} size={35} />}
          />
      </Grid>
      
      <Grid size={6} item >
      <IndicatorCard
            title="Aguardando avaliação"
            total={notIdentify}
            icon={<GrDocumentTime style={{color: 'rgb(0,133,66)'}} size={35} />}
          /></Grid>
      
    </Grid>
  </Box>
  );
};
export default IndicatorPriceAta;
