import { useState, useMemo, useCallback, useEffect } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem as MenuItemComponent,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  InputAdornment,
  Badge,
  Avatar,
  TablePagination,
  Skeleton,
  LinearProgress,
  Tooltip,
} from "@mui/material"
import {
  Search,
  Download,
  Upload,
  MoreVert,
  Inventory2,
  Description,
  Settings,
  AttachMoney,
  Menu as MenuIcon,
  Dashboard,
  Inventory,
  Assignment,
  Analytics,
  AccountCircle,
  Notifications,
  PriceCheck,
  Engineering,
  Gavel,
  Business,
  HourglassEmpty,
  FirstPage,
  LastPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { useDashboard } from '../../useContext';
import { getCountIndicator, getTableData } from '../../api';
import { _assembleOrFilterGeneric } from '../../utils';
import logoSimpleGfex from '../../assets/logoSimpleGfex.png';
import logopetrobras from '../../assets/logopetrobras.png';
// Tema customizado para manter o padrão shadcn/ui
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0f172a", // slate-900 similar ao shadcn
      light: "#334155", // slate-700
      dark: "#020617", // slate-950
    },
    secondary: {
      main: "#3b82f6", // blue-500
      light: "#60a5fa", // blue-400
      dark: "#1d4ed8", // blue-700
    },
    background: {
      default: "#f8fafc", // slate-50
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a", // slate-900
      secondary: "#64748b", // slate-500
    },
    grey: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
    },
    success: {
      main: "#10b981", // emerald-500
      light: "#34d399",
      dark: "#059669",
    },
    warning: {
      main: "#f59e0b", // amber-500
      light: "#fbbf24",
      dark: "#d97706",
    },
    info: {
      main: "#8b5cf6", // violet-500
      light: "#a78bfa",
      dark: "#7c3aed",
    },
    error: {
      main: "#ef4444", // red-500
      light: "#f87171",
      dark: "#dc2626",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: "1.875rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          border: "1px solid #e2e8f0",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
        outlined: {
          borderColor: "#e2e8f0",
          color: "#64748b",
          "&:hover": {
            borderColor: "#cbd5e1",
            backgroundColor: "#f8fafc",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlined: {
          borderColor: "#e2e8f0",
          color: "#64748b",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#f8fafc",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: "#374151",
        },
      },
    },
  },
})

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

// Itens do menu de navegação
const navigationItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/" },
  { text: "Comercialização", icon: <Inventory />, path: "/materiais" },
  { text: "Minuta Contratual", icon: <Assignment />, path: "/contratos" },
  { text: "Info. Técnicas", icon: <Engineering />, path: "/info-tecnicas" }
]

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

  // Estados da UI
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentPage, setCurrentPage] = useState("Dashboard")

  const { loadingPage, countIndicators, loadData, materials, supplier } = useDashboard();

  // Simular API call com delay
  const fetchMaterials = async (page, pageSize, filters) => {
    // Simular delay de rede
    const sFiltersClasses = _assembleOrFilterGeneric(supplier, 'classDesc', 'class', 'class');
    const sFiltersManufactureres = _assembleOrFilterGeneric(supplier, 'mfrnr', 'manufacturer', 'text');
    const sFilter = `fornecedorInex eq '10097577'and (${sFiltersClasses}) and (${sFiltersManufactureres})`

    const _items = await getTableData({
      $top: 200000,
      $filter: sFilter
    });
    const itemsWithIds = _items.map((item, index) => {
      item.id = index;
      return item;
    });

    const allMaterials = itemsWithIds === null ? [] : itemsWithIds

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
    loadData();
  }, [loadMaterials])

  // Reset da página quando filtros mudarem
  useEffect(() => {
    setPage(0)
  }, [searchTerm, filterCategory, filterStatus])

  // Calcular indicadores (usando dados simulados para performance)
  const indicators = useMemo(() => {
    // Para indicadores, usamos uma amostra menor para performance
    const sampleSize = 1000
    const sampleMaterials = materials === null ? [] : materials

    const total = sampleMaterials?.length

    // Comercialização
    const comercializaAprovado = sampleMaterials.filter((m) => m.comercializaStatus === true).length
    const comercializaRejeitado = sampleMaterials.filter((m) => m.comercializaStatus === false).length
    const comercializaAguardando = sampleMaterials.filter((m) => m.comercializaStatus === null).length

    // Minuta Contratual
    const minutaAprovado = sampleMaterials.filter((m) => m.minutaContratualStatus === true).length
    const minutaRejeitado = sampleMaterials.filter((m) => m.minutaContratualStatus === false).length
    const minutaAguardando = sampleMaterials.filter((m) => m.minutaContratualStatus === null).length

    // Informações Técnicas
    const infoTecnicaAprovado = sampleMaterials.filter((m) => m.informacoesTecnicasStatus === true).length
    const infoTecnicaRejeitado = sampleMaterials.filter((m) => m.informacoesTecnicasStatus === false).length
    const infoTecnicaAguardando = sampleMaterials.filter((m) => m.informacoesTecnicasStatus === null).length

    // Ata de Preço
    const ataAprovado = sampleMaterials.filter((m) => m.ataPrecoStatus === true).length
    const ataRejeitado = sampleMaterials.filter((m) => m.ataPrecoStatus === false).length
    const ataAguardando = sampleMaterials.filter((m) => m.ataPrecoStatus === null).length

    return {
      comercializacao: {
        aprovado: comercializaAprovado,
        rejeitado: comercializaRejeitado,
        aguardando: comercializaAguardando,
        total,
      },
      minutaContratual: {
        aprovado: minutaAprovado,
        rejeitado: minutaRejeitado,
        aguardando: minutaAguardando,
        total,
      },
      informacoesTecnicas: {
        aprovado: infoTecnicaAprovado,
        rejeitado: infoTecnicaRejeitado,
        aguardando: infoTecnicaAguardando,
        total,
      },
      ataPreco: {
        aprovado: ataAprovado,
        rejeitado: ataRejeitado,
        aguardando: ataAguardando,
        total,
      },
    }
  }, [])

  // Atualizar status do material
  const updateMaterialStatus = (id, field, value) => {
    setMaterials_((prev) => prev.map((material) => (material.id === id ? { ...material, [field]: value } : material)))
  }

  // Handlers de paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const categories = [
    "Cimento",
    "Agregados",
    "Aço",
    "Alvenaria",
    "Tintas",
    "Madeira",
    "Elétrico",
    "Hidráulico",
    "Ferramentas",
    "Acabamento",
  ]

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNavigationClick = (item) => {
    setCurrentPage(item.text)
    setDrawerOpen(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
        {/* Header */}
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", borderBottom: "1px solid #e2e8f0" }}>
          <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
            <IconButton
              size="large"
              edge="start"
              sx={{ mr: 2, color: "text.primary" }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            <img src={logoSimpleGfex} />

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', marginInline: '10px' }}>
              <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1, mr: 2 }}>
                <Button variant="outlined" size="small" startIcon={<Upload />}>
                  Importar
                </Button>
                <Button variant="outlined" size="small" startIcon={<Download />}>
                  Exportar
                </Button>
              </Box>

              <IconButton onClick={handleMenuClick} sx={{ color: "text.primary" }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main", fontSize: "0.875rem" }}>F</Avatar>
              </IconButton>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItemComponent onClick={handleMenuClose}>
                <AccountCircle sx={{ mr: 1 }} />
                Meu Perfil
              </MenuItemComponent>
              
            </Menu>
            <img src={logopetrobras} style={{ height: '30px' }} />
          </Toolbar>
        </AppBar>

        {/* Drawer de Navegação */}
        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 280 }}>
            <Box sx={{ p: 3, bgcolor: "primary.main", color: "white" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Business sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Plataforma do Fornecedor
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Sistema de Gestão de Materiais
              </Typography>
            </Box>
            <List sx={{ pt: 2 }}>
              {navigationItems.map((item) => (
                <ListItem key={item.text} disablePadding sx={{ px: 2 }}>
                  <ListItemButton
                    selected={currentPage === item.text}
                    onClick={() => handleNavigationClick(item)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      "&.Mui-selected": {
                        bgcolor: "secondary.light",
                        color: "white",
                        "&:hover": {
                          bgcolor: "secondary.main",
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: currentPage === item.text ? "white" : "text.secondary",
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: currentPage === item.text ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Indicadores */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Comercialização
                    </Typography>
                    <Inventory2 sx={{ color: "text.secondary" }} />
                  </Box>
                  <Typography variant="h4" sx={{ color: "success.main", mb: 1, fontWeight: 700 }}>
                    {countIndicators.comercializacao.recog}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {countIndicators.comercializacao.notRecog} rejeitados
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <HourglassEmpty sx={{ fontSize: 14, color: "warning.main" }} />
                      <Typography variant="body2" sx={{ color: "warning.main", fontWeight: 500 }}>
                        {countIndicators.comercializacao.notIdentify} aguardando avaliação
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      label={`${Math.round((countIndicators.comercializacao.recog / countIndicators.comercializacao.total) * 100)}%`}
                      size="small"
                      variant="outlined"
                      sx={{ bgcolor: "success.light", color: "white", borderColor: "success.main" }}
                    />
                    {/* {countIndicators.comercializacao.notRecog > 0 && ( */}
                    <Chip
                      label={`${Math.round((countIndicators.comercializacao.notRecog / countIndicators.comercializacao.total) * 100)}%`}
                      size="small"
                      variant="outlined"
                      sx={{ bgcolor: "error.light", color: "white", borderColor: "error.main" }}
                    />
                    {/* // )} */}
                    {/* // {countIndicators.comercializacao.notIdentify > 0 && ( */}
                    <Chip
                      label={`${Math.round((countIndicators.comercializacao.notIdentify / countIndicators.comercializacao.total) * 100)}%`}
                      size="small"
                      variant="outlined"
                      sx={{ bgcolor: "warning.light", color: "white", borderColor: "warning.main" }}
                    />
                    {/* // )} */}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Informações Técnicas
                    </Typography>
                    <Engineering sx={{ color: "text.secondary" }} />
                  </Box>
                  <Typography variant="h4" sx={{ color: "success.main", mb: 1, fontWeight: 700 }}>
                    {countIndicators.informacoesTecnicas.approved}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {countIndicators.informacoesTecnicas.awaitApproval} aguardando Aprovação
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <HourglassEmpty sx={{ fontSize: 14, color: "warning.main" }} />
                      <Typography variant="body2" sx={{ color: "warning.main", fontWeight: 500 }}>
                        {countIndicators.informacoesTecnicas.notIdentify} aguardando avaliação
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      label={`${Math.round((countIndicators.informacoesTecnicas.approved / countIndicators.informacoesTecnicas.total) * 100)}%`}
                      size="small"
                      variant="outlined"
                      sx={{ bgcolor: "success.light", color: "white", borderColor: "success.main" }}
                    />
                    {/* {countIndicators.informacoesTecnicas.awaitApproval > 0 && ( */}
                    <Chip
                      label={`${Math.round((countIndicators.informacoesTecnicas.awaitApproval / countIndicators.informacoesTecnicas.total) * 100)}%`}
                      size="small"
                      variant="outlined"
                      sx={{ bgcolor: "info.light", color: "white", borderColor: "info.main" }}
                    />
                    {/* )} */}
                    {/* {countIndicators.informacoesTecnicas.notIdentify > 0 && ( */}
                    <Chip
                      label={`${Math.round((countIndicators.informacoesTecnicas.notIdentify / countIndicators.informacoesTecnicas.total) * 100)}%`}
                      size="small"
                      variant="outlined"
                      sx={{ bgcolor: "warning.light", color: "white", borderColor: "warning.main" }}
                    />
                    {/* )} */}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Minuta Contratual
                    </Typography>
                    <Description sx={{ color: "text.secondary" }} />
                  </Box>
                  <Typography variant="h4" sx={{ color: "success.main", mb: 1, fontWeight: 700 }}>
                    {countIndicators.minutaContratual.agree}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {countIndicators.minutaContratual.notAgree} rejeitados
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <HourglassEmpty sx={{ fontSize: 14, color: "warning.main" }} />
                      <Typography variant="body2" sx={{ color: "warning.main", fontWeight: 500 }}>
                        {countIndicators.minutaContratual.notIdentify} aguardando avaliação
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      label={`${Math.round((countIndicators.minutaContratual.agree / countIndicators.minutaContratual.total) * 100)}%`}
                      size="small"
                      variant="outlined"
                      sx={{ bgcolor: "success.light", color: "white", borderColor: "sucess.main" }}
                    />
                    {/* {countIndicators.minutaContratual.notAgree > 0 && ( */}
                    <Chip
                      label={`${Math.round((countIndicators.minutaContratual.notAgree / countIndicators.minutaContratual.total) * 100)}%`}
                      size="small"
                      variant="outlined"
                      sx={{ bgcolor: "warning.light", color: "white", borderColor: "warning.main" }}
                    />
                    {/* // )} */}
                    {/* // {countIndicators.minutaContratual.notIdentify > 0 && ( */}
                    <Chip
                      label={`${Math.round((countIndicators.minutaContratual.notIdentify / countIndicators.minutaContratual.total) * 100)}%`}
                      size="small"
                      variant="outlined"
                      sx={{ bgcolor: "warning.light", color: "white", borderColor: "warning.main" }}
                    />
                    {/* )} */}
                  </Box>
                </CardContent>
              </Card>
            </Grid>



            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Ata de Preço
                    </Typography>
                    <AttachMoney sx={{ color: "text.secondary" }} />
                  </Box>
                  <Typography variant="h4" sx={{ color: "success.main", mb: 1, fontWeight: 700 }}>
                    {countIndicators.ataPreco.filled}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, marginTop: '16%' }}>
                      <HourglassEmpty sx={{ fontSize: 14, color: "warning.main" }} />
                      <Typography variant="body2" sx={{ color: "warning.main", fontWeight: 500 }}>
                        {countIndicators.ataPreco.notFilled} aguardando avaliação
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      label={`${Math.round((countIndicators.ataPreco.filled / countIndicators.ataPreco.total) * 100)}%`}
                      size="small"
                      variant="outlined"
                      sx={{ bgcolor: "success.light", color: "white", borderColor: "success.main" }}
                    />
                    {/* {indicators.ataPreco.notFilled > 0 && ( */}
                    <Chip
                      label={`${Math.round((countIndicators.ataPreco.notFilled / countIndicators.ataPreco.total) * 100)}%`}
                      size="small"
                      variant="outlined"
                      sx={{ bgcolor: "warning.light", color: "white", borderColor: "warning.main" }}
                    />
                    {/* )} */}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

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
                  <Typography variant="body2" color="text.secondary">
                    {totalCount.toLocaleString()} materiais encontrados
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
                          {/*<TableCell>
                              <Skeleton width={80} />
                            </TableCell>
                            <TableCell align="right">
                              <Skeleton width={40} />
                            </TableCell> */}
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
                                bgcolor:
                                  material.NmReconhecido === 'Comercializo' ? "success.light" :
                                    material.NmReconhecido === 'Não Comercializo' ? "error.light" : "secondary.light",
                                color: "white",
                                borderColor:
                                  material.NmReconhecido === 'Comercializo' ? "success.main" :
                                    material.NmReconhecido === 'Não Comercializo' ? "error.main" : "secondary.main"
                              }}
                              label={material.NmReconhecido} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Chip
                              sx={{
                                bgcolor:
                                  material.AtaPrecoPreenchida === 'Preenchida' ? "success.light" :
                                    material.AtaPrecoPreenchida === 'Não Aplicável' ? "error.light" :
                                      material.AtaPrecoPreenchida === 'Preencher' ? "info.light" : "",
                                color:
                                  material.AtaPrecoPreenchida === 'Preenchida' ||
                                    material.AtaPrecoPreenchida === 'Não Aplicável' ||
                                    material.AtaPrecoPreenchida === 'Preencher' ? 'white' : '',

                                borderColor:
                                  material.AtaPrecoPreenchida === 'Preenchida' ? "success.main" :
                                    material.AtaPrecoPreenchida === 'Não Aplicável' ? "error.main" :
                                      material.AtaPrecoPreenchida === 'Preencher' ? "info.main" : "",
                              }}
                              label={material.AtaPrecoPreenchida} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Chip
                              sx={{
                                bgcolor:
                                  material.InformacoesTecnicas === 'Validada' ? "success.light" :
                                    material.InformacoesTecnicas === 'Não Aplicável' ? "error.light" :
                                      material.InformacoesTecnicas === 'Validar' ? "info.light" : "",
                                color:
                                  material.InformacoesTecnicas === 'Validada' ||
                                    material.InformacoesTecnicas === 'Não Aplicável' ||
                                    material.InformacoesTecnicas === 'Validar' ? 'white' : '',

                                borderColor:
                                  material.InformacoesTecnicas === 'Validada' ? "success.main" :
                                    material.InformacoesTecnicas === 'Não Aplicável' ? "error.main" :
                                      material.InformacoesTecnicas === 'Validar' ? "info.main" : "",
                              }}
                              label={material.InformacoesTecnicas} size="small" variant="outlined" />
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
      </Box>
    </ThemeProvider>
  )
}
