import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { useDashboard } from '../../useContext';
import { postRecogMat, putRecogMat } from '../../api';

const motivos = [
  'Obsoleto',
  'Perca de exclusividade',
  'Informação insuficiente',
  'Nao identificado',
  'Pn divergente do descritivo do texto breve',
  'Falta de estoque',
  'Outro',
];

export default function SelectCarac({ open, onClose, dataSelected, aMaterials }) {
  const [motivoSelecionado, setMotivoSelecionado] = useState('');
  const [motivoLivre, setMotivoLivre] = useState('');
  const { loadData } = useDashboard();

  const handleChange = (event) => {
    setMotivoSelecionado(event.target.value);
    if (event.target.value !== 'Outro') {
      setMotivoLivre('');
    }
  };

  const handleSave = async () => {
    const motivoFinal = motivoSelecionado === 'Outro' ? motivoLivre.trim() : motivoSelecionado;

    let aPromises = [];
    const recog = 'NCM';
    const priceAta = 'NAP';
    const tecInfo = 'NAP';
    const { postRecog, putRecog } = dataSelected.reduce((acc, material) => {
      const oMaterial = aMaterials.find((item, idx) => (item.id === material))
      const oEntry = {
        "Nm": oMaterial.matnr,
        "DataCriacao": null,
        "UsuarioCriador": "EMERSON",
        "NmReconhecido": recog,
        "AtaPrecoPreenchida": priceAta,
        "InformacoesTecnicas": tecInfo
      }

      if (oMaterial.NmReconhecido === 'Falta Identificação') {
        acc.postRecog.push(oEntry)
      } else {
        acc.putRecog.push(oEntry)

      }
      return acc

    }, { postRecog: [], putRecog: [] })
    aPromises = postRecog.map((oEntry) => (postRecogMat(oEntry)));
    aPromises = putRecog.map((oEntry) => (putRecogMat(oEntry)));

    await Promise.all(aPromises);
    loadData();

    onClose(motivoFinal);
  };

  const isSaveDisabled =
    motivoSelecionado === '' || (motivoSelecionado === 'Outro' && motivoLivre.trim() === '');

  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={() => onClose(null)}>
      <DialogTitle>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'medium' }}>
          Motivo não reconhecimento
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1, mb: 2 }}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="motivo-label">Motivo</InputLabel>
            <Select
              labelId="motivo-label"
              value={motivoSelecionado}
              onChange={handleChange}
              label="Motivo"
              autoFocus
              sx={{ mb: 2 }}
            >
              {motivos.map((motivo) => (
                <MenuItem key={motivo} value={motivo}>
                  {motivo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {motivoSelecionado === 'Outro' && (
            <TextField
              label="Informe o motivo"
              variant="outlined"
              size="small"
              fullWidth
              value={motivoLivre}
              onChange={(e) => setMotivoLivre(e.target.value)}
              autoFocus
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleSave} disabled={isSaveDisabled} variant="contained">
          Salvar
        </Button>
        <Button onClick={() => onClose(null)} color="inherit">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
