import React from "react";
import { Grid, Box } from '@mui/material';
import IndicatorCard from '../../components/indicator/IndicatorCard';
import { BsCardChecklist } from "react-icons/bs";
import { MdNotInterested, MdPriceCheck } from "react-icons/md";
import { GrDocumentTime } from "react-icons/gr";
const IndicatorContractMinute = ({ agree, notAgree, notIdentify }) => {
  return (
    <Box sx={{ padding: '10px' }}>
      <Grid container spacing={3} >
        <Grid size={4} item >
          <IndicatorCard
            title="Concorda"
            total={agree}
            icon={<BsCardChecklist style={{ color: 'rgb(0,133,66)' }} size={35} />}
          />
        </Grid>
        <Grid size={4} item >
          <IndicatorCard
            title="Não Concordado"
            total={notAgree}
            icon={<MdNotInterested style={{ color: 'rgb(0,133,66)' }} size={35} />}
          /></Grid>
        <Grid size={4} item >
          <IndicatorCard
            title="Aguardando avaliação"
            total={notIdentify}
            icon={<GrDocumentTime style={{ color: 'rgb(0,133,66)' }} size={35} />}
          /></Grid>

      </Grid>
    </Box>
  );
};
export default IndicatorContractMinute;
