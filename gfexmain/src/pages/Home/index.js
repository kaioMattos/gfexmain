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
import TableMaterial from '../../components/Table/material';
import FilterMaterial from '../../components/Table/material/Filter'


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


export default function HomePage() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [materials_, setMaterials_] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const [searchTerm, setSearchTerm] = useState("")
  const [filterInfoTec, setfilterInfoTec] = useState("all")
  const [filterRecog, setFilterRecog] = useState("all")
  const { loadingPage, countIndicators, loadData, materials, supplier } = useDashboard();

  const fetchMaterials = async (page, pageSize, filters) => {
    const allMaterials = materials === null ? [] : materials
    const filteredMaterials = allMaterials.filter((material) => {
      const matchesSearch =
        !filters.searchTerm ||
        material.maktx.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        material.matnr.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        material.classDesc.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        material.mfrpn.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        material.mfrnr.toLowerCase().includes(filters.searchTerm.toLowerCase())

      const matchesCategory = filters.filterInfoTec === "all" || material.InformacoesTecnicas === filters.filterInfoTec

      let matchesStatus = true
      if (filters.filterRecog === "comercializa") {
        matchesStatus = material.NmReconhecido === "Comercializo";
      } else if (filters.filterRecog === "nao-comercializa") {
        matchesStatus = material.NmReconhecido === "Não Comercializo";
      } else if (filters.filterRecog === "pendente") {
        matchesStatus = material.NmReconhecido !== "Comercializo" && material.NmReconhecido !== "Não Comercializo";
      }
      return matchesSearch && matchesCategory && matchesStatus
    })

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

  const loadMaterials = useCallback(async () => {
    setLoading(true)

    try {
      const result = await fetchMaterials(page, rowsPerPage, {
        searchTerm,
        filterInfoTec,
        filterRecog,
      })
      setMaterials_(result.materials)
      setTotalCount(result.totalCount)
    } catch (error) {
      console.error("Erro ao carregar materiais:", error)
    } finally {
      setLoading(false)
    }
  }, [page, rowsPerPage, searchTerm, filterInfoTec, filterRecog])

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials])

  useEffect(() => {
    setPage(0)
  }, [searchTerm, filterInfoTec, filterRecog])

  return (

    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Indicators dataIndicator={countIndicators} />
      <FilterMaterial
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        filterRecog={filterRecog} setFilterRecog={setFilterRecog}
        filterInfoTec={filterInfoTec} setFilterInfoTec={setfilterInfoTec}
        funcPage='Home'
      />
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
          {loading && <LinearProgress sx={{ mb: 2 }} />}
          <TableMaterial
            materials={materials_}
            totalCount={totalCount}
            selectedMaterials={selectedMaterials} setSelectedMaterials={setSelectedMaterials}
            rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage}
            page={page} setPage={setPage}
            isMultSelect={false}
            funcPage='Home'
          />
        </CardContent>
      </Card>
    </Container>
  )
}
