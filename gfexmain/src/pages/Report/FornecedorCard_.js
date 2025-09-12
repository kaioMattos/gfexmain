import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';

import StorageIcon from '@mui/icons-material/Storage'; // para materiais
import FactoryIcon from '@mui/icons-material/Factory'; // fabricantes
import CategoryIcon from '@mui/icons-material/Category'; // classes
import DownloadIcon from '@mui/icons-material/Download'; // exportar
import ClassIcon from '@mui/icons-material/Class';
import EngineeringIcon from '@mui/icons-material/Engineering'; // sugestões técnicas

function FornecedorCard({ fornecedor, onExport, countMat }) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {fornecedor.documentId}
        </Typography>

      {/* Seção de sugestões técnicas */}
      <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bgcolor="#f5f5f5"
          p={2}
          borderRadius={2}
          mb={3}
        >
          <Box display="flex" alignItems="center">
            <EngineeringIcon sx={{ color: '#1976d2', mr: 1 }} />
            <Typography variant="subtitle1">
              Informações técnicas sugeridas para <strong>{countMat}</strong> materia{(countMat === 1 ? 'l' : 'is')}
            </Typography>
          </Box>

          <Tooltip title="Exportar lista de sugestões">
            <span>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={onExport}
                // disabled={sugestoesCount === 0}
              >
                Exportar
              </Button>
            </span>
          </Tooltip>
        </Box>

        <Grid container spacing={10}>
          {/* Fabricantes */}
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <FactoryIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="h6">Fabricantes</Typography>
            </Box>
            <List dense>
              {fornecedor.manufacturer.map((manuf) => (
                <ListItem key={manuf.ManufacturerNumber} disablePadding>
                  <ListItemText primary={manuf.text} />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

          {/* Classes Responsáveis */}
          <Grid item xs={12} md={5}>
            <Box display="flex" alignItems="center" mb={1}>
              <ClassIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="h6">Classes Responsáveis</Typography>
            </Box>
            <List dense>
              {fornecedor.class.map((cls) => (
                <ListItem key={cls.numberClass} disablePadding>
                  <ListItemText primary={cls.text} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default FornecedorCard;
