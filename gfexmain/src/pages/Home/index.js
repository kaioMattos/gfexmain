import { useState, useCallback, useEffect } from "react"
import {
  Typography, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Select,
  MenuItem, FormControl, InputLabel, Chip, Box,
  Container, Grid,
  IconButton, Tooltip,
  MenuItem as MenuItemComponent,
  InputAdornment,
  TablePagination, Skeleton, LinearProgress
} from "@mui/material"
import {
  Search, Menu as MenuIcon, FirstPage, LastPage,
  KeyboardArrowLeft, KeyboardArrowRight,
} from "@mui/icons-material";

import { useDashboard } from '../../useContext';
import Indicators from "./Indicators";

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="primeira página">
        <FirstPage />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="página anterior">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="próxima página"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="última página"
      >
        <LastPage />
      </IconButton>
    </Box>
  )
}



export default function MaterialManagementPlatform() {
  // Estados para paginação
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [materials_, setMaterials_] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const { loadingPage, countIndicators, loadData, materials, supplier } = useDashboard();

  // Recuperar Dados do contexto
  const fetchMaterials = async (page, pageSize, filters) => {
    const allMaterials = materials === null ? [] : materials
    // Aplicar filtros
    const filteredMaterials = allMaterials.filter((material) => {
      const matchesSearch =
        !filters.searchTerm ||
        material.maktx.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        material.matnr.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        material.classDesc.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        material.mfrpn.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        material.mfrnr.toLowerCase().includes(filters.searchTerm.toLowerCase())

      const matchesCategory = filters.filterCategory === "all" || material.categoria === filters.filterCategory

      let matchesStatus = true
      if (filters.filterStatus === "comercializa") matchesStatus = material.comercializa
      else if (filters.filterStatus === "nao-comercializa") matchesStatus = !material.comercializa

      return matchesSearch && matchesCategory && matchesStatus
    })

    // Calcular paginação
    const startIndex = page * pageSize
    const endIndex = startIndex + pageSize
    const paginatedMaterials = filteredMaterials.slice(startIndex, endIndex)

    return {
      materials: paginatedMaterials,
      totalCount: filteredMaterials.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredMaterials.length / pageSize),
    }
  }

  // Função para carregar dados
  const loadMaterials = useCallback(async () => {
    setLoading(true)

    try {
      const result = await fetchMaterials(page, rowsPerPage, {
        searchTerm,
        filterCategory,
        filterStatus,
      })
      setMaterials_(result.materials)
      setTotalCount(result.totalCount)
    } catch (error) {
      console.error("Erro ao carregar materiais:", error)
    } finally {
      setLoading(false)
    }
  }, [page, rowsPerPage, searchTerm, filterCategory, filterStatus])

  // Carregar dados quando os filtros mudarem
  useEffect(() => {
    loadMaterials();
  }, [loadMaterials])

  // Reset da página quando filtros mudarem
  useEffect(() => {
    setPage(0)
  }, [searchTerm, filterCategory, filterStatus])

  // Handlers de paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const categories = [
    "Comercializo",
    "Não Comercializo"
  ]
  return (

    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Indicadores */}
      <Indicators dataIndicator={countIndicators} />

      {/* Filtros e Busca */}
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
                  value={filterCategory}
                  label="Comercialização"
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <MenuItem value="all">Todas os Status</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Ata Preço</InputLabel>
                <Select value={filterStatus} label="Ata Preço" onChange={(e) => setFilterStatus(e.target.value)}>
                  <MenuItem value="all">Todos os status</MenuItem>
                  <MenuItem value="comercializa">Comercializa</MenuItem>
                  <MenuItem value="nao-comercializa">Não comercializa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Info. Técnicas</InputLabel>
                <Select value={filterStatus} label="Info. Técnicas" onChange={(e) => setFilterStatus(e.target.value)}>
                  <MenuItem value="all">Todos os status</MenuItem>
                  <MenuItem value="comercializa">Comercializa</MenuItem>
                  <MenuItem value="nao-comercializa">Não comercializa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabela de Materiais */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Lista de Materiais
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', fontSize: '0.975rem' }} >
                <span className="destTotalMat">{totalCount.toLocaleString()}</span> materiais encontrados
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {loading && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Carregando...
                  </Typography>
                </Box>
              )}
              <Tooltip title="Atualizar dados">
                <IconButton onClick={loadMaterials} disabled={loading}>
                  <Search />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Barra de progresso durante carregamento */}
          {loading && <LinearProgress sx={{ mb: 2 }} />}

          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Material</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Classe</TableCell>
                  <TableCell>N° peça fabricante</TableCell>
                  <TableCell>Fabricante</TableCell>
                  <TableCell>Comercializado</TableCell>
                  <TableCell>Ata Preço</TableCell>
                  <TableCell>Info. Técnicas</TableCell>
                  {/*<TableCell align="center">Info. Técnicas</TableCell>
                      <TableCell align="center">Ata Preço</TableCell>
                      <TableCell>Preço</TableCell>
                      <TableCell align="right">Ações</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? // Skeleton loading
                  Array.from(new Array(rowsPerPage)).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton width={80} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={200} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={100} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={60} />
                      </TableCell>
                      <TableCell align="center">
                        <Skeleton width={40} />
                      </TableCell>
                      <TableCell align="center">
                        <Skeleton width={40} />
                      </TableCell>
                      <TableCell align="center">
                        <Skeleton width={40} />
                      </TableCell>
                      <TableCell align="center">
                        <Skeleton width={40} />
                      </TableCell>
                    </TableRow>
                  ))
                  : materials_.map((material) => (
                    <TableRow key={material.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{material.matnr}</TableCell>
                      <TableCell>{material.maktx}</TableCell>
                      <TableCell sx={{ width: '100%' }}>{material.classDesc}</TableCell>
                      <TableCell>{material.mfrpn}</TableCell>
                      <TableCell>{material.mfrnr}</TableCell>
                      <TableCell>
                        <Chip
                          sx={{
                            width: '172px',
                            bgcolor:
                              material.NmReconhecido === 'Comercializo' ? "success.light" :
                                material.NmReconhecido === 'Não Comercializo' ? "error.light" : "warning.light",
                            color: "white",
                            borderColor:
                              material.NmReconhecido === 'Comercializo' ? "success.main" :
                                material.NmReconhecido === 'Não Comercializo' ? "error.main" : "warning.main"
                          }}
                          label={material.NmReconhecido !== 'Comercializo' &&
                            material.NmReconhecido !== 'Não Comercializo' ?
                            'Pendente Avaliação' : material.NmReconhecido} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          sx={{
                            width: '172px',
                            bgcolor:
                              material.AtaPrecoPreenchida === 'Preenchida' ? "success.light" :
                                material.AtaPrecoPreenchida === 'Não Aplicável' ? "greyInfo.light" :
                                  material.AtaPrecoPreenchida === 'Preencher' ? "warning.light" : "",
                            color:
                              material.AtaPrecoPreenchida === 'Preenchida' ||
                                material.AtaPrecoPreenchida === 'Não Aplicável' ||
                                material.AtaPrecoPreenchida === 'Preencher' ? 'white' : '',

                            borderColor:
                              material.AtaPrecoPreenchida === 'Preenchida' ? "success.main" :
                                material.AtaPrecoPreenchida === 'Não Aplicável' ? "greyInfo.main" :
                                  material.AtaPrecoPreenchida === 'Preencher' ? "warning.main" : "",
                          }}
                          label={material.AtaPrecoPreenchida === 'Preencher' ?
                            'Pendente Avaliação' : material.AtaPrecoPreenchida} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          sx={{
                            width: '172px',
                            bgcolor:
                              material.InformacoesTecnicas === 'Validada' ? "success.light" :
                                material.InformacoesTecnicas === 'Não Aplicável' ? "greyInfo.light" :
                                  material.InformacoesTecnicas === 'Validar' ? "warning.light" :
                                    material.InformacoesTecnicas === 'Aguardando Avaliação Petrobrás'
                                      ? "info.light" : "",
                            color:
                              material.InformacoesTecnicas === 'Validada' ||
                                material.InformacoesTecnicas === 'Aguardando Avaliação Petrobrás' ||
                                material.InformacoesTecnicas === 'Não Aplicável' ||
                                material.InformacoesTecnicas === 'Validar' ? 'white' : '',

                            borderColor:
                              material.InformacoesTecnicas === 'Validada' ? "success.main" :
                                material.InformacoesTecnicas === 'Não Aplicável' ? "greyInfo.main" :
                                  material.InformacoesTecnicas === 'Validar' ? "warning.main" :
                                    material.InformacoesTecnicas === 'Aguardando Avaliação Petrobrás' ?
                                      "info.main" : "",
                          }}
                          label={
                            material.InformacoesTecnicas === 'Validar' ? 'Pendente Avaliação' :
                              material.InformacoesTecnicas === 'Aguardando Avaliação Petrobrás' ? 'Em Análise(Petro)' :
                                material.InformacoesTecnicas} size="small" variant="outlined" />
                      </TableCell>

                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginação */}
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
            labelRowsPerPage="Itens por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count.toLocaleString() : `mais de ${to.toLocaleString()}`}`
            }
            sx={{
              borderTop: "1px solid #e2e8f0",
              "& .MuiTablePagination-toolbar": {
                paddingLeft: 2,
                paddingRight: 2,
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                fontSize: "0.875rem",
                color: "text.secondary",
              },
            }}
          />
        </CardContent>
      </Card>
    </Container>
  )
}
