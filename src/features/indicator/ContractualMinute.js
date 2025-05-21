import React from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import IndicatorCard from '../../components/dashboard/IndicatorCard';
import { BsCardChecklist } from "react-icons/bs";
import { MdNotInterested, MdPriceCheck } from "react-icons/md";
import { GrDocumentTime } from "react-icons/gr";
const IndicatorContractMinute = ({agree, notAgree, notIdentify}) => {
  return (
    <Box sx={{ padding: '10px' }}>
    <Grid container spacing={6} style={{paddingInline:'5%'}}>
      <Grid size={4} item >
      <IndicatorCard
            title="Concorda"
            total={agree}
            icon={<BsCardChecklist style={{color: 'rgb(0,133,66)'}} size={40} />}
          />
      </Grid>
      <Grid size={4} item >
      <IndicatorCard
            title="Não Concordado"
            total={notAgree}
            icon={<MdNotInterested style={{color: 'rgb(0,133,66)'}} size={40} />}
          /></Grid>
      <Grid size={4} item >
      <IndicatorCard
            title="Aguardando avaliação"
            total={notIdentify}
            icon={<GrDocumentTime style={{color: 'rgb(0,133,66)'}} size={40} />}
          /></Grid>
      
    </Grid>
  </Box>
  );
};
export default IndicatorContractMinute;
