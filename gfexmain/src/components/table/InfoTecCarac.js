import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Table, TableBody, TableContainer, TableHead, TableRow, TextField, Switch, IconButton,
  Grid, Typography, Button, Tooltip
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import AutoCompleteInfoTec from '../modal/AutoCompleteInfoTec';
import CustomUISwitch from '../input/Switch'
import FileUploadComponent from '../input/FileUpload';
import { IoIosAttach } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { IoDuplicateOutline } from "react-icons/io5";
import SelectFile from '../modal/SelectFile';
import SelectCarac from '../modal/SelectCarac';
import { useDashboard } from '../../useContext';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'aliceblue',
    color: 'rgb(0,136,66)'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const label = { inputProps: { 'aria-label': 'Color switch demo' } };

export default function CustomizedTables({ data }) {
  const [openDialogRecog, setoOpenDialogRecog] = useState(false);
  const [openDialogSelecCarac, setopenDialogSelecCarac] = useState(false);
  const { selectedMaterialsMastDet, setFieldValueMatSelect, loadingPage } = useDashboard();

  const [rowSelected, setRowSelected] = useState({});
  const handleClose = () => {
    setoOpenDialogRecog(false);
  };
  const handleCloseDialogCarac = () => {
    setopenDialogSelecCarac(false);
  };
  const setOpenDialogCarac = (data) => {
    setopenDialogSelecCarac(true);
    setRowSelected(data)
  }
  const setOpenDialog = (data) => {
    setoOpenDialogRecog(true);
    setRowSelected(data)
  }
  const deleteFile = (row) => {
    const oValue = selectedMaterialsMastDet.fields
    .filter((item) => item.PosCarac === row.PosCarac)[0];
    oValue['fileName'] = '';
    setFieldValueMatSelect(oValue);

  }
  return (
    <>
      <Grid container >
        <Grid item size={12} container><Typography>Concordar com todos ?</Typography> <CustomUISwitch data='all'
         dataRow={{Agreed:data.every((item)=>item.Agreed)}} /></Grid>
        {/* <Grid item size={12} container><Typography>Replicar Evidências</Typography> <FileUploadComponent /></Grid> */}
      </Grid>
      <SelectCarac open={openDialogSelecCarac} onClose={() => handleCloseDialogCarac()} data={rowSelected} />
      <SelectFile open={openDialogRecog} onClose={() => handleClose()} data={rowSelected} />
      <TableContainer sx={{ minWidth: 700, maxHeight: 310 }} >
        <Table aria-label="customized table" stickyHeader >
          <TableHead >
            <TableRow>
              <StyledTableCell align="left" sx={{ padding: '10px 6px' }}>Característica</StyledTableCell>
              {/* <StyledTableCell align="left" sx={{ padding: '10px 6px' }}>Valor</StyledTableCell> */}
              <StyledTableCell align="left" sx={{ padding: '10px 6px' }}>Concordar ?</StyledTableCell>
              <StyledTableCell align="left" sx={{ padding: '10px 6px' }}>Valor Proposto (Se necessário)</StyledTableCell>
              <StyledTableCell align="left" sx={{ padding: '10px 6px' }}>Evidências</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.PosCarac} >
                <TableCell align="left" sx={{ padding: '7px' }}>
                  <Grid item sx={{ alignContent: 'center', color: 'rgb(0,136,66)' }}>
                    <Grid>
                      <Typography sx={{ fontSize: '0.9rem' }}>{row.Carac}</Typography>
                    </Grid>
                    <Grid sx={{ alignContent: 'center', color: 'rgb(105,105,105)', margin: '4px 3px 0px' }}>
                      <Typography sx={{ fontSize: '0.8rem' }}>{row.Valor === '' ? 'N/A' : row.Valor}</Typography>
                    </Grid>
                  </Grid>
                </TableCell >
                {/* <TableCell align="left" sx={{padding: '7px'}}>{row.Valor === '' ? 'N/A' : row.Valor}</TableCell > */}
                <TableCell align="left" sx={{ padding: '7px' }}>
                  <CustomUISwitch data='unic' dataRow={row}  />
                </TableCell >
                <TableCell align="left" sx={{ padding: '7px' }}>
                  {row.Carac === 'PartNumber' || row.Carac === 'Fabricante' ? (
                    <TextField
                    onChange={(event) => {
                      
                      const oValue = selectedMaterialsMastDet.fields
                      .filter((item)=>item.Carac === row.Carac && item.PosCarac === row.PosCarac)[0]
                      oValue['NovoValor'] = event.target.value
                      setFieldValueMatSelect(oValue);
              
                    }}
                      required
                      id="outlined-hidden-label-normal"
                      variant="outlined"
                      size="small"
                      sx={{ width: '80%' }}
                      disabled={row.Agreed}
                    
                    />) : (<AutoCompleteInfoTec data={row} />)}
                </TableCell >
                <TableCell align="left" sx={{ padding: '7px' }}>
                  <Tooltip title="Escolher Arquivo">
                    <IconButton onClick={() => { setOpenDialog(row) }}  disabled={row.Agreed}>
                      <IoIosAttach />
                    </IconButton>
                  </Tooltip>
                  {/* <FileUploadComponent/> */}
                  <Tooltip title="Duplicar Arquivo" color="primary">
                    <IconButton disabled={row.fileName !== '' && row.fileName !== undefined ? false : true} onClick={() => { setOpenDialogCarac(row) }}>
                      <IoDuplicateOutline />
                    </IconButton>
                  </Tooltip>
                 
                  
                  {row.fileName !== undefined && row.fileName !== '' ? (
                    <>
                      <Tooltip title="Deletar Arquivo">
                        <IconButton disabled={row.Agreed} onClick={() => { deleteFile(row) }} color="error">
                          <MdDelete />
                        </IconButton>
                      </Tooltip>
                    </>
                  ):(<></>)}
                <p>{row.fileName}</p>
                </TableCell >
              </TableRow >
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}