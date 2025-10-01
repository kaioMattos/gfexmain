import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Typography from '@mui/material/Typography';

import { styled, Button, Grid } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function CustomDialog({ 
  handleClose, 
  open,
  message = "Sua solicitação foi enviada para o time Petrobrás avaliar", 
  color = "rgb(0, 133, 66)",
  icon = "success"
}) {

  const getIcon = () => {
    if (icon === "error") return <ErrorOutlineIcon style={{ fontSize: 50, color }} />;
    if (icon === "success") return <CheckCircleIcon style={{ fontSize: 50, color }} />;
    return null; // sem ícone
  };

  return (
    <Dialog
      sx={{ border: `1px solid ${color}`, borderRadius:'10px' }}
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {/* <DialogTitle id="alert-dialog-title">GFEX</DialogTitle> */}
      <DialogContent>
        <Grid container >
          <Grid item xs={12} sm={12} container style={{justifyContent:'center', paddingBottom:'15px'}}>
            <IconButton>
              <IconButton disableRipple>{getIcon()}</IconButton>
            </IconButton>
          </Grid>
          <Grid item xs={12} sm={12} container style={{justifyContent:'center'}}>
            <DialogContentText id="alert-dialog-description">
              {message}
            </DialogContentText>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', paddingBottom:'10px' }}>
      <Button variant="contained" style={{backgroundColor:'rgb(28,115,163)', color:'white'}} onClick={handleClose} >
        {/* <Button onClick={handleClose} color="primary"> */}
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}