import React from "react";
import { Grid, Box } from '@mui/material';
import { BsCardChecklist } from "react-icons/bs";
import { MdNotInterested, MdPriceCheck } from "react-icons/md";
import { GrDocumentTime } from "react-icons/gr";
import IndicatorCard from '../../../components/indicator/IndicatorCard';

const IndicatorContractMinute = ({ agree, notAgree, notIdentify }) => {
  return (
    <Box sx={{ padding: '10px' }}>
      <Grid container spacing={3} >
        <Grid size={4} item >
          <IndicatorCard
            title="Concorda"
            total={agree}
            icon={<BsCardChecklist size={35} />}
          />
        </Grid>
        <Grid size={4} item >
          <IndicatorCard
            title="Não Concordado"
            total={notAgree}
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
export default IndicatorContractMinute;
