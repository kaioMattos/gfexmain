import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Button, TextField, IconButton } from '@mui/material';
import { useDashboard } from 'useContext';
import { MdOutlineListAlt } from "react-icons/md";
import ListValueModal from 'components/modal/ListValue_Modal';
import AutoCompleteInfoTec from 'components/modal/AutoCompleteInfoTec'; 


export default function Detail() {
  const [open, setOpen] = useState(false);
  const [openAC, setOpenAC] = useState(false);
  
  const { selectedMaterialsMastDet } = useDashboard();
  const handleClose = async () => {
    setOpen(false);
  };
  
  
  return (
    <>
      <Grid container sx={{
        border: '1px solid rgb(0,133,66)', borderRadius: '8px'
      }}>

        <Grid item size={12}>
          <Grid sx={{
            backgroundColor: 'rgb(0,142,145)',
            borderRadius: '6px 6px 0px 0px', marginTop: '-1px'
          }}>
            <Typography component="div" sx={{ color: 'white', textAlign: 'left', padding: '8px' }}>
              {selectedMaterialsMastDet.matnr} - Material
            </Typography>
          </Grid>
        </Grid>
        <Grid item size={12} sx={{ padding: '1rem' }}>

          <Grid container spacing={2} sx={{ color: 'rgb(0,136,66)' }}>
            <Grid item size={4} ><Typography sx={{ fontSize: '1.2rem', fontFamily: 'PetrobrasSans_Bd' }}>Caracteristica</Typography></Grid>
            <Grid item size={4} ><Typography sx={{ fontSize: '1.2rem', fontFamily: 'PetrobrasSans_Bd' }}>Valor</Typography></Grid>
            <Grid item size={4} ><Typography sx={{ fontSize: '1.2rem', fontFamily: 'PetrobrasSans_Bd' }}>Valor Proposto</Typography></Grid>
          </Grid>
          <Box className="divDetailField">
            <Grid container spacing={2} sx={{ marginTop: '1.3rem' }}>
              <Grid item size={4} sx={{ alignContent: 'center', color: 'rgb(0,136,66)' }}><Typography>PartNumber</Typography></Grid>
              <Grid item size={4} sx={{ alignContent: 'center', color: 'rgb(105,105,105)' }}><Typography>XXXXXXXX</Typography></Grid>
              <Grid item size={4} sx={{ alignContent: 'center' }}><TextField
                id="outlined-hidden-label-normal"
                defaultValue=""
                variant="outlined"
                size="small"
                sx={{ width: 250 }}
              /></Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
              <Grid item size={4} sx={{ alignContent: 'center', color: 'rgb(0,136,66)' }}><Typography>Fabricante</Typography></Grid>
              <Grid item size={4} sx={{ alignContent: 'center', color: 'rgb(105,105,105)' }}><Typography>ABC</Typography></Grid>
              <Grid item size={4} sx={{ alignContent: 'center' }}><TextField
                id="outlined-hidden-label-normal"
                defaultValue=""
                variant="outlined"
                size="small"
                sx={{ width: 250 }}
              /></Grid>

            </Grid>
            {selectedMaterialsMastDet.fields.map((item) => (
              <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid item size={4} sx={{ alignContent: 'center', color: 'rgb(0,136,66)' }}><Typography>{item.Caracteristica}</Typography></Grid>
                <Grid item size={4} sx={{ alignContent: 'center', color: 'rgb(105,105,105)' }}><Typography>{item.Valor}</Typography></Grid>
                <Grid item size={4} sx={{ alignContent: 'center' }}>
                  <AutoCompleteInfoTec data={item}/>
                  </Grid>
              </Grid>
            ))}
          </Box>
          {/* <ListValueModal handleClose={() => handleClose()} open={open} data={dialogValues} /> */}
          <div className="buttons">
            <Button className="button" >
              Recusar
            </Button>
            <Button
              variant="contained" className="button" >
              Aprovar
            </Button>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
