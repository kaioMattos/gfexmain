import React, { useEffect, useState } from "react";
import { Typography, Box, Grid } from '@mui/material';

export default function Detail() {
  
  return (
    <>
     <Grid container style={{
        border: '1px solid rgb(0,133,66)', borderRadius: '8px'
      }}>
        <Grid item size={12}>
          <Box style={{
            backgroundColor: 'rgb(0,142,145)',
            borderRadius: '6px 6px 0px 0px', marginTop: '-1px'
          }}>
            <Typography component="div" sx={{ color: 'white', textAlign: 'left', padding: '8px' }}>
               - Material
            </Typography>
          </Box>
        </Grid>
        <Grid item size={12}>
          <Box style={{
            margin: '15px',
            flexGrow: 1, border: '1px solid #ccc5c5', borderRadius: '6px'
          }}></Box>
         </Grid>
      </Grid>
    </>
  );
}
