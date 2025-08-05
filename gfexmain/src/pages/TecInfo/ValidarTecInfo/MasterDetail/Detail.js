import React, { useState } from "react";
import { Typography, Box, Grid, Button, TextField, IconButton } from '@mui/material';
import { useDashboard } from '../../../../useContext';
import { MdOutlineListAlt } from "react-icons/md";
// import ListValueModal from './components/modal/ListValue_Modal';
import AutoCompleteInfoTec from '../../../../components/modal/AutoCompleteInfoTec';
import { putInfoTec, postInfoTecCarac, putMaterial } from '../../../../api';
import FileUploadComponent from '../../../../components/input/FileUpload'
import { CgAttachment } from "react-icons/cg";
import CustomizedTables from '../../../../components/table/InfoTecCarac';

export default function Detail() {
  const [open, setOpen] = useState(false);
  const [openAC, setOpenAC] = useState(false);

  const { selectedMaterialsMastDet, setFieldValueMatSelect, loadData, loadingPage } = useDashboard();
  const handleClose = async () => {
    setOpen(false);
  };

  const saveTecInfo = async () => {
    const status = selectedMaterialsMastDet.fields.every((item) => (item.Agreed)) ? 'VLD' : 'AAP'
    const oEntryMain = {
      "Nm": selectedMaterialsMastDet.matnr,
      "Classe": "",
      "Fabricante": "",
      "Status": ""
    };
    const oEntryReconhecimento = {
      "Nm": selectedMaterialsMastDet.matnr,
      "InformacoesTecnicas": status
    };
    const oEntryCarac = selectedMaterialsMastDet.fields
      // .filter((item) => (item.hasOwnProperty('NovoValor') && item.NovoValor !== ''))
      .map((item) => (
        {
          "Nm": selectedMaterialsMastDet.matnr,
          "PosCarac": (item.Carac === 'PartNumber' || item.Carac === 'Fabricante') ? '' : item.PosCarac,
          "PosValor": (item.Carac === 'PartNumber' || item.Carac === 'Fabricante') ? '' :
            item.Agreed ? item.PosValor : item.NovoValor,
          "Concorda": item.Agreed,
          "DadoMestre": (item.Carac === 'PartNumber' || item.Carac === 'Fabricante') ? true : false,
          "NomeCaracDm": (item.Carac === 'PartNumber' || item.Carac === 'Fabricante') ? item.Carac : '',
          "ValorCaracDm": (item.Carac === 'PartNumber' || item.Carac === 'Fabricante') ? item.NovoValor : ''
        }));
    let aPromises = [];
    console.log(oEntryReconhecimento);
    console.log(oEntryCarac);
    try {
      aPromises.push(putMaterial(oEntryReconhecimento));
      aPromises.push(...oEntryCarac.map((oEntry) => (postInfoTecCarac(oEntry))));
      const resolvedPromises = await Promise.all(aPromises);
    } catch (e) {

    } finally {
      await loadData();
    }
  }
  const handleInput = (data, event) => {
    const oValue = selectedMaterialsMastDet.fields
      .filter((item) => item.Carac === data)[0]
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

          <CustomizedTables data={selectedMaterialsMastDet.fields} />
          {/* <Grid container spacing={2} sx={{ color: 'rgb(0,136,66)' }}>
            <Grid item size={3} ><Typography sx={{ fontSize: '1rem', fontFamily: 'PetrobrasSans_Bd' }}>Carac</Typography></Grid>            
            <Grid item size={4} ><Typography sx={{ fontSize: '1rem', fontFamily: 'PetrobrasSans_Bd' }}>Valor Proposto</Typography></Grid>
            <Grid item size={3} ><Typography sx={{ fontSize: '1rem', fontFamily: 'PetrobrasSans_Bd' }}>Anexar Evidencia</Typography></Grid>
          </Grid>
          <Box className="divDetailField" component="form">

            {selectedMaterialsMastDet.fields.map((item) => (

              <Grid container spacing={2} sx={{ marginTop: '1rem', borderBottom:'1px solid #e6eaee',
                padding:'5px'
               }}>

                <Grid item size={3} sx={{ alignContent: 'center', color: 'rgb(0,136,66)' }}>
                  <Grid>
                    <Typography sx={{ fontSize: '0.9rem' }}>{item.Carac}</Typography>
                  </Grid>
                  <Grid sx={{ alignContent: 'center', color: 'rgb(105,105,105)', margin: '4px 3px 0px' }}>
                    <Typography sx={{ fontSize: '0.8rem' }}>{item.Valor === '' ? 'N/A' : item.Valor}</Typography>
                  </Grid>
                </Grid>                
                <Grid item size={4} sx={{ alignContent: 'center' }}>
                  {item.Carac === 'PartNumber' || item.Carac === 'Fabricante' ? (
                    <TextField
                      required
                      id="outlined-hidden-label-normal"
                      defaultValue=""
                      variant="outlined"
                      size="small"
                      sx={{ width: '80%' }}
                      onChange={(event) => handleInput(item.Carac, event)}
                    />) : (<AutoCompleteInfoTec data={item} />)}

                </Grid>
                <Grid item size={3} sx={{ alignContent: 'center', color: 'rgb(105,105,105)' }}>
                  <IconButton><CgAttachment/></IconButton>
                </Grid>

              </Grid>
            ))}
          </Box> */}
          {/* <ListValueModal handleClose={() => handleClose()} open={open} data={dialogValues} /> */}
          <div className="buttons">
            <Button
              variant="contained" type="submit" className="buttonOldDesign" onClick={saveTecInfo}>
              Enviar
            </Button>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
