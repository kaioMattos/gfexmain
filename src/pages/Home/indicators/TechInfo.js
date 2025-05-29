import React from "react";
import { Grid, Box } from '@mui/material';
import { RiPassValidLine } from "react-icons/ri";
import { GrDocumentTime } from "react-icons/gr";
import { LuClipboardCheck } from "react-icons/lu";
import IndicatorCard from '../../../components/indicator/IndicatorCard';

const IndicatorTechInfo = ({ approved, revision, notIdentify }) => {
  return (
    <Box sx={{ padding: '10px' }}>
      <Grid container spacing={3} >
        <Grid size={4} item >
          <IndicatorCard
            title="Dados aprovados"
            total={approved}
            icon={<LuClipboardCheck size={35} />}
          /></Grid><Grid size={4} item >
          <IndicatorCard
            title="Revisão solicitada"
            total={revision}
            icon={<RiPassValidLine size={35} />}
          /></Grid><Grid size={4} item >
          <IndicatorCard
            title="Aguardando avaliação"
            total={notIdentify}
            icon={<GrDocumentTime size={35} />}
          /></Grid>

      </Grid>
    </Box>
  );
};
export default IndicatorTechInfo;
