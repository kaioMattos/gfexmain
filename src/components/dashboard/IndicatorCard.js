
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
      sx={{
        "&:hover": {
          backgroundColor: 'rgb(0,101,96)',
          opacity: 1,
          boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2)',
        },
        cursor: 'pointer',
        p: 2,
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
        borderRadius: '4px',
        transition: '0.3s',
        position: 'relative',
        backgroundColor: 'rgb(0,127,120)'
      }}
      onClick={()=>handleClickIndicator(linkClick)}>
      <Box >
        {icon}
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
          <Typography variant='h4' sx={{ color: '#EAFF00', p: 1, fontWeight: 'Bold' }}>{total}</Typography>
          <Typography variant='subtitle1' sx={{ color: 'white', p: 1, fontWeight: 'Medium' }}>{title}</Typography>
        </Box>
      </Box>
    </Card>
  );
}
export default IndicatorCard;