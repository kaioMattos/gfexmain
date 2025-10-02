import { useState, useCallback, useEffect, useRef } from "react"
import {
  Typography, Card, CardContent, Box, Container,
  IconButton, Tooltip, LinearProgress
} from "@mui/material"
import { Search } from "@mui/icons-material";

import { useDashboard } from '../../useContext';
import Indicators from "./Indicators";
import TableMaterial from '../../components/Table/material';
import FilterMaterial from '../../components/Table/material/Filter'
import MetaUrl from '../../components/MetaUrl';
import Header from '../../components/Header'


export default function Home() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [materials_, setMaterials_] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const hasLoadedData = useRef(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterInfoTec, setfilterInfoTec] = useState("all")
  const [filterRecog, setFilterRecog] = useState("all")
  const { loadingPage, countIndicators, materials, loadData } = useDashboard();

  const fetchMaterials = async (page, pageSize, filters, data) => {
    const allMaterials = data || []
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
    }
  }, [page, rowsPerPage, searchTerm, filterInfoTec, filterRecog])

  useEffect(() => {
    const loadFilteredMaterials = async () => {
      if (!materials) return;

      try {
        const result = await fetchMaterials(page, rowsPerPage, {
          searchTerm,
          filterInfoTec,
          filterRecog,
        }, materials)
        setMaterials_(result.materials)
        setTotalCount(result.totalCount)
      } catch (error) {
        console.error("Erro ao carregar materiais:", error)
      }
    }

    loadFilteredMaterials()
  }, [materials, page, rowsPerPage, searchTerm, filterInfoTec, filterRecog])

  useEffect(() => {
    const fetchData = async () => {
      if (!hasLoadedData.current) {
        await loadData()
        hasLoadedData.current = true
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <MetaUrl title="GFEX" description="Gestão de Fornecedores Exclusivos" />
        <Indicators dataIndicator={countIndicators} loading={loadingPage}/>
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
                {loadingPage && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Carregando...
                    </Typography>
                  </Box>
                )}
                <Tooltip title="Atualizar dados">
                  <IconButton onClick={loadMaterials} disabled={loadingPage}>
                    <Search />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            {loadingPage && <LinearProgress sx={{ mb: 2 }} />}
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
    </>
  )
}