import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Button, TextField, CircularProgress } from '@mui/material';
import { useDashboard } from '../../../../useContext';
import { MdOutlineListAlt } from "react-icons/md";
// import ListValueModal from './components/modal/ListValue_Modal';
import AutoCompleteInfoTec from '../../../../components/modal/AutoCompleteInfoTec';
import { putInfoTec, postInfoTec, putMaterial } from '../../../../api';


export default function Detail() {
  const [open, setOpen] = useState(false);
  const [openAC, setOpenAC] = useState(false);

  const { selectedMaterialsMastDet, setFieldValueMatSelect, loadData, loadingPage } = useDashboard();
  const handleClose = async () => {
    setOpen(false);
  };

  const saveTecInfo = async () => {
    const oEntry = {
      "Nm": selectedMaterialsMastDet.matnr,
      "InformacoesTecnicas": "VLD"
    };
    
    const oEntryFields = selectedMaterialsMastDet.fields
      .filter((item) => (item.hasOwnProperty('NovoValor') && item.NovoValor !== ''))
      .map((item) => ({
        "Nm": selectedMaterialsMastDet.matnr,
        "Classe": item.Classe,
        "PosCarac": item.PosCarac,
        "PosValor": item.hasOwnProperty('PosValor') ? item.PosValor : '',
        "Valor": item.NovoValor
      }));
      let aPromises = [];
    console.log(selectedMaterialsMastDet)
    if (selectedMaterialsMastDet.InformacoesTecnicas === 'Validar') {
      aPromises = oEntryFields.map((oEntry) => (postInfoTec(oEntry)));
    }else{
      aPromises = oEntryFields.map((oEntry) => (putInfoTec(oEntry)));
      
    }
    aPromises.push(putMaterial(oEntry));
    const resolvedPromises = await Promise.all(aPromises);
    await loadData();
  }
  const handleInput = (data, event) => {
    const oValue = selectedMaterialsMastDet.fields
      .filter((item) => item.Caracteristica === data)[0]
    oValue['NovoValor'] = event.target.value;
    setFieldValueMatSelect(oValue);
  }
  return (
   
           
    <>
      <Grid container sx={{
        border: '1px solid rgb(0,133,66)', borderRadius: '8px', backgroundColor: 'white'
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
            <Grid item size={3} ><Typography sx={{ fontSize: '1rem', fontFamily: 'PetrobrasSans_Bd' }}>Caracteristica</Typography></Grid>
            {/* <Grid item size={4} ><Typography sx={{ fontSize: '1rem', fontFamily: 'PetrobrasSans_Bd' }}>Valor</Typography></Grid> */}
            <Grid item size={4} ><Typography sx={{ fontSize: '1rem', fontFamily: 'PetrobrasSans_Bd' }}>Valor Proposto</Typography></Grid>
          </Grid>
          <Box className="divDetailField" component="form">

            {selectedMaterialsMastDet.fields.map((item) => (

              <Grid container spacing={2} sx={{ marginTop: '1rem', borderBottom:'1px solid #e6eaee',
                padding:'5px'
               }}>

                <Grid item size={3} sx={{ alignContent: 'center', color: 'rgb(0,136,66)' }}>
                  <Grid>
                    <Typography sx={{ fontSize: '0.9rem' }}>{item.Caracteristica}</Typography>
                  </Grid>
                  <Grid sx={{ alignContent: 'center', color: 'rgb(105,105,105)', margin: '4px 3px 0px' }}>
                    <Typography sx={{ fontSize: '0.8rem' }}>{item.Valor === '' ? 'N/A' : item.Valor}</Typography>
                  </Grid>
                </Grid>
                {/* <Grid item size={4} sx={{ alignContent: 'center', color: 'rgb(105,105,105)' }}><Typography sx={{ fontSize: '0.9rem' }}>{item.Valor}</Typography></Grid> */}
                <Grid item size={4} sx={{ alignContent: 'center' }}>
                  {item.Caracteristica === 'PartNumber' || item.Caracteristica === 'Fabricante' ? (
                    <TextField
                      required
                      id="outlined-hidden-label-normal"
                      defaultValue=""
                      variant="outlined"
                      size="small"
                      sx={{ width: 250 }}
                      onChange={(event) => handleInput(item.Caracteristica, event)}
                    />) : (<AutoCompleteInfoTec data={item} />)}

                </Grid>
              </Grid>
            ))}
          </Box>
          {/* <ListValueModal handleClose={() => handleClose()} open={open} data={dialogValues} /> */}
          <div className="buttons">
            <Button
              variant="contained" type="submit" className="button" onClick={saveTecInfo}>
              Aprovar
            </Button>
          </div>
        </Grid>
      </Grid>
      </>
  );
}
