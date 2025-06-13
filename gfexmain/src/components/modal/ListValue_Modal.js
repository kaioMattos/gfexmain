import * as React from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid,
  Autocomplete, TextField, Typography
} from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

function renderRow(props) {
  const { index, style } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={`Item ${index + 1}`} />
      </ListItemButton>
    </ListItem>
  );
}

export default function ListValueModal({ open, handleClose, data }) {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(Number(event.target.value) || '');
  };

  return (
    <div style={{ width: '50%', height: '50%' }}>
      <Dialog
        fullWidth
        maxWidth="sm"
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{data.field}</DialogTitle>
        <DialogContent sx={{ height: '250px' }}>
          <Grid container>
            <Grid item size={7}>
              <Autocomplete
                disablePortal

                options={data.values.map((option) => option.Valor)}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} hiddenLabel placeholder="Pesquisar" />}
                size="small"
              />
              </Grid>
               <Grid item size={5}>
              <Button onClick={handleClose}>Valor não encontrado</Button>
            </Grid>

            <Grid item size={12} sx={{marginTop:'5%'}}>
              <Typography>Inserir Manualmente</Typography>
            </Grid>
            <Grid item size={12}>
              <TextField
                sx={{ width: 300 }}
                hiddenLabel
                id="filled-hidden-label-small"
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleClose}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
