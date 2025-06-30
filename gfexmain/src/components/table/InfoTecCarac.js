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
import { IoDuplicateOutline } from "react-icons/io5";
import SelectFile from '../modal/SelectFile';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'aliceblue',
    color: 'rgb(0,136,66)',
    fontFamily: 'PetrobrasSans_Bd'
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
  const handleClose = () => {
    setoOpenDialogRecog(false);
  };
  return (
    <>
      <Grid container >
        <Grid item size={12}><Typography>Operações em Massa</Typography></Grid>
        <Grid item size={12} container><Typography>Aprovar todos ?</Typography> <CustomUISwitch /></Grid>
        {/* <Grid item size={12} container><Typography>Replicar Evidências</Typography> <FileUploadComponent /></Grid> */}
      </Grid>
      <SelectFile open={openDialogRecog} onClose={() => handleClose()} />
      <TableContainer sx={{ minWidth: 700, maxHeight: 310 }} >
        <Table aria-label="customized table" stickyHeader >
          <TableHead >
            <TableRow>
              <StyledTableCell align="left" sx={{ padding: '10px 6px' }}>Característica</StyledTableCell>
              {/* <StyledTableCell align="left" sx={{ padding: '10px 6px' }}>Valor</StyledTableCell> */}
              <StyledTableCell align="left" sx={{ padding: '10px 6px' }}>Aprovado ?</StyledTableCell>
              <StyledTableCell align="left" sx={{ padding: '10px 6px' }}>Valor Proposto(Se necessário)</StyledTableCell>
              <StyledTableCell align="left" sx={{ padding: '10px 6px' }}>Evidências</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.PosCarac} >
                <TableCell align="left" sx={{ padding: '7px' }}>
                  <Grid item sx={{ alignContent: 'center', color: 'rgb(0,136,66)' }}>
                    <Grid>
                      <Typography sx={{ fontSize: '0.9rem' }}>{row.Caracteristica}</Typography>
                    </Grid>
                    <Grid sx={{ alignContent: 'center', color: 'rgb(105,105,105)', margin: '4px 3px 0px' }}>
                      <Typography sx={{ fontSize: '0.8rem' }}>{row.Valor === '' ? 'N/A' : row.Valor}</Typography>
                    </Grid>
                  </Grid>
                </TableCell >
                {/* <TableCell align="left" sx={{padding: '7px'}}>{row.Valor === '' ? 'N/A' : row.Valor}</TableCell > */}
                <TableCell align="left" sx={{ padding: '7px' }}>
                  <CustomUISwitch />
                </TableCell >
                <TableCell align="left" sx={{ padding: '7px' }}>
                  {row.Caracteristica === 'PartNumber' || row.Caracteristica === 'Fabricante' ? (
                    <TextField
                      required
                      id="outlined-hidden-label-normal"
                      defaultValue=""
                      variant="outlined"
                      size="small"
                      sx={{ width: '80%' }}

                    />) : (<AutoCompleteInfoTec data={row} />)}
                </TableCell >
                <TableCell align="left" sx={{ padding: '7px' }}>
                  <Tooltip title="Escolher Arquivo">
                    <IconButton onClick={() => { setoOpenDialogRecog(true) }}>
                      <IoIosAttach />
                    </IconButton>
                  </Tooltip>
                  {/* <FileUploadComponent/> */}
                  <Tooltip title="Replicar Arquivo" color="primary">
                    <IconButton >
                      <IoDuplicateOutline />
                    </IconButton>
                  </Tooltip>

                </TableCell >
              </TableRow >
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}