import { useState, useEffect } from "react"
import {
  Typography, Card, CardContent, TextField, Box,
  MenuItem, FormControl, InputLabel,
  Container, Grid,
  MenuItem as MenuItemComponent,
  InputAdornment, Button, CircularProgress
} from "@mui/material";
import {
  Search,
  Download,
  CorporateFare,
  Engineering
} from "@mui/icons-material";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import FornecedorCard from './FornecedorCard';
import { getUserHana, getCountIndSugg, getDataSugg } from "../../api";
import { _assembleOrFilterGeneric } from '../../utils';


export default function ReportPage() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countMat, setCountMat] = useState(0);
  
  const getCountMaterial = async () => {
    setLoading(true);
    setError(null);
    try {
      const resultCount = await getCountIndSugg();
      setCountMat(resultCount);
      setError(false);

    } catch (err) {
      setError('Erro ao buscar Sugestões.');
    } finally {
      setLoading(false);
    }
  }
  const exportExcel = async () => {
    const resultSugg = await getDataSugg();
    const unique = Array.from(
      new Set(resultSugg.value.map(obj => JSON.stringify(obj)))
    ).map(str => JSON.parse(str));

    const aMaterials = unique;
    console.log(aMaterials);
    const aMaterialsRemap = aMaterials.map((item) => ({
      'Nm': item.matnr,
      'Texto Breve': item.maktx,
      'Código Classe': item.class,
      'Classe': item.classDesc,
      'Campo': item.dado_mestre ? item.nome_carac_dm : item.Carac,
      'Valor Sugerido': item.concorda ? '' : item.dado_mestre ? item.valor_carac_dm : item.DescValor,
      'Fornecedor': item.nomeForncedor
    }));
    const ws = XLSX.utils.json_to_sheet(aMaterialsRemap);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Materiais');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'Materiais.xlsx');
  }

    useEffect(() => {
      getCountMaterial();    
    }, [])
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Filtros e Busca */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Relatório - Informações Técnicas
          </Typography>
          <Grid container spacing={3} bgcolor="#f5f5f5" borderRadius={2} mb={3} p={2}>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <Engineering sx={{ color: '#1976d2', mr: 1 }} />
                <Typography variant="subtitle1">
                  Informações técnicas sugeridas <strong>{countMat}</strong>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1, mr: 2 }}>
                <Button onClick={exportExcel} variant="outlined" size="small" startIcon={<Download />}>
                  Exportar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {loading && (
        <Box sx={{ mt: 3 }}>
          <CircularProgress />
          <Typography>Buscando Sugestões...</Typography>
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 3 }}>
          {error}
        </Typography>
      )}
    </Container>
  )
}
