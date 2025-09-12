import {
  Typography, Card, CardContent,
  TextField, Select,
  MenuItem, FormControl, InputLabel, Box,
  Grid,
  IconButton,
  MenuItem as MenuItemComponent,
  InputAdornment,
} from "@mui/material"
import {
  Search, Menu as MenuIcon, FirstPage, LastPage,
  KeyboardArrowLeft, KeyboardArrowRight
} from "@mui/icons-material";



export default function FilterMaterial({
  funcPage,
  searchTerm, setSearchTerm,
  filterRecog, setFilterRecog,
  filterInfoTec, setFilterInfoTec
}) {



  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Filtros e Busca
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Buscar Material"
              placeholder="Buscar por nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Comercialização</InputLabel>
              <Select
                value={filterRecog}
                label="Comercialização"
                onChange={(e) => setFilterRecog(e.target.value)}
              >
                <MenuItem value="all">Todos os status</MenuItem>
                <MenuItem value="comercializa">Comercializados</MenuItem>
                <MenuItem value="nao-comercializa">Não Comercializados</MenuItem>
                <MenuItem value="pendente">Pendente Avaliação</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {funcPage === 'Home' && <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Info. Técnicas</InputLabel>
              <Select value={filterInfoTec} label="Info. Técnicas" onChange={(e) => setFilterInfoTec(e.target.value)}>
                <MenuItem value="all">Todos os status</MenuItem>
                <MenuItem value="Validar">Pendente Avaliação</MenuItem>
                <MenuItem value="Aguardando Avaliação Petrobrás">Em Análise (PETROBRAS)</MenuItem>
                <MenuItem value="Validada">Validada</MenuItem>
                <MenuItem value="Não Aplicável">Não Aplicável</MenuItem>
                <MenuItem value="Aguardando Identificação">Aguardando Identificação</MenuItem>
              </Select>
            </FormControl>
          </Grid>}

        </Grid>
      </CardContent>
    </Card>
  )
}
