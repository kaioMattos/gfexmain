import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Button, TextField } from '@mui/material';

export default function Detail() {

  return (
    <>
      <Grid container sx={{
        border: '1px solid rgb(0,133,66)', borderRadius: '8px', height:'100%'
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
        <Grid item size={12} sx={{ padding: '1rem' }}>
          <Box>
            <Grid container spacing={2} sx={{ color: 'rgb(0,136,66)' }}>
              <Grid item size={4} ><Typography sx={{ fontSize: '1.2rem' }}>Caracteristica</Typography></Grid>
              <Grid item size={4} ><Typography sx={{ fontSize: '1.2rem' }}>Valor</Typography></Grid>
              <Grid item size={4} ><Typography sx={{ fontSize: '1.2rem' }}>Valor Proposto</Typography></Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: '1.3rem' }}>
              <Grid item size={4} sx={{ alignContent: 'center' }}><Typography>PartNumber</Typography></Grid>
              <Grid item size={4} sx={{ alignContent: 'center' }}><Typography>XXXXXXXX</Typography></Grid>
              <Grid item size={4} sx={{ alignContent: 'center' }}><TextField
                id="outlined-hidden-label-normal"
                defaultValue=""
                variant="outlined"
                size="small"
              /></Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item size={4} sx={{ alignContent: 'center' }}><Typography>Fabricante</Typography></Grid>
              <Grid item size={4} sx={{ alignContent: 'center' }}><Typography>ABC</Typography></Grid>
              <Grid item size={4} sx={{ alignContent: 'center' }}><TextField
                id="outlined-hidden-label-normal"
                defaultValue=""
                variant="outlined"
                size="small"
              /></Grid>
            </Grid>
          </Box>
          <Box>
            <div className="buttons">
              <Button className="button" >
                Recusar
              </Button>
              <Button
                variant="contained" className="button" >
                Aprovar
              </Button>
            </div>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
