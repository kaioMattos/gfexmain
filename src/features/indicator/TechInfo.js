import React from "react";
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import IndicatorCard from '../../components/indicator/IndicatorCard';
import { RiPassValidLine } from "react-icons/ri";
import { GrDocumentTime } from "react-icons/gr";
import { LuClipboardCheck } from "react-icons/lu";
const IndicatorTechInfo = ({approved, revision, notIdentify}) => {
  return (
    <Box sx={{ padding: '10px' }}>
      <Grid container spacing={3} >       
        <Grid size={4} item >
          <IndicatorCard
            title="Dados aprovados"
            total={approved}
            icon={<LuClipboardCheck style={{color: 'rgb(0,133,66)'}} size={35} />}
          /></Grid><Grid size={4} item >
          <IndicatorCard
            title="Revisão solicitada"
            total={revision}
            icon={<RiPassValidLine style={{color: 'rgb(0,133,66)'}} size={35} />}
          /></Grid><Grid size={4} item >
          <IndicatorCard
            title="Aguardando avaliação"
            total={notIdentify}
            icon={<GrDocumentTime style={{color: 'rgb(0,133,66)'}} size={35} />}
          /></Grid>
        
      </Grid>
    </Box>
  );
};
export default IndicatorTechInfo;
