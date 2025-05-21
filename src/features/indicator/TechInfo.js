import React from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import IndicatorCard from '../../components/dashboard/IndicatorCard';
import { RiPassValidLine } from "react-icons/ri";
import { GrDocumentTime } from "react-icons/gr";
import { LuClipboardCheck } from "react-icons/lu";
const IndicatorTechInfo = ({approved, revision, notIdentify}) => {
  return (
    <Box sx={{ padding: '10px' }}>
      <Grid container spacing={6} style={{paddingInline:'5%'}}>       
        <Grid size={4} item >
          <IndicatorCard
            title="Dados aprovados"
            total={approved}
            icon={<LuClipboardCheck style={{color: 'rgb(0,133,66)'}} size={40} />}
          /></Grid><Grid size={4} item >
          <IndicatorCard
            title="Revisão solicitada"
            total={revision}
            icon={<RiPassValidLine style={{color: 'rgb(0,133,66)'}} size={40} />}
          /></Grid><Grid size={4} item >
          <IndicatorCard
            title="Aguardando avaliação"
            total={notIdentify}
            icon={<GrDocumentTime style={{color: 'rgb(0,133,66)'}} size={40} />}
          /></Grid>
        
      </Grid>
    </Box>
  );
};
export default IndicatorTechInfo;
