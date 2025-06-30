import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { IoClose } from "react-icons/io5";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function SelectFile({ open, onClose }) {
  const handleDialogClose = () => {
    onClose(false); // Use the prop.
  };
  return (

    <React.Fragment>
    <Dialog
      fullWidth="true"
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Selecionar Arquivo
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <IoClose />
      </IconButton>
      <DialogContent dividers>
        <Typography gutterBottom>
          Tela em Desenvolvimento
        </Typography>
        <Typography gutterBottom>
          Tela em Desenvolvimento
        </Typography>
        <Typography gutterBottom>
          Tela em Desenvolvimento
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
    </React.Fragment>
  );
}