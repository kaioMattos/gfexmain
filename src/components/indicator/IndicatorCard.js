
import { useState } from 'react';

import Box from '@mui/material/Box';
import { Card, Typography } from '@mui/material';

const IndicatorCard = ({
  title,
  total,
  icon,
  linkClick,
  ...other
}) => {
  const handleClickIndicator = (url)=>{
    window.open(url, "_blank", "noreferrer");
  }
  return (
    <Card
    border="secondary"
      sx={{
        "&:hover": {
          backgroundColor: 'rgb(224, 220, 220)',
          opacity: 1,
          boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2)',
        },
        cursor: 'pointer',
        padding: '16px 0',
        // boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
        borderRadius: '10px',
        borderColor:'rgb(218, 218, 218)',
        transition: '0.3s',
        position: 'relative',
        backgroundColor: 'rgb(255,255,255)',
        minHeight:'100%'
      }}
      onClick={()=>handleClickIndicator(linkClick)}>
      <Box sx={{ color:'rgb(0,133,66)'}}>
        {icon}
        <Typography variant='subtitle1' sx={{ p: 1, fontWeight: 'Medium', fontSize:'0.95rem' }}>{title}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant='h4' className="font-face-ptRg" sx={{ fontFamily:'PetrobrasSans_Rg', color: 'rgb(153, 153, 153)', p: 1, fontWeight: 'Bold' }}>{total}</Typography>
        </Box>
      </Box>
    </Card>
  );
}
export default IndicatorCard;