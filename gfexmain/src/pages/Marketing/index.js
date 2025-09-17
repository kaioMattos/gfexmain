import { useState, useCallback, useEffect } from "react"
import {
  Typography, Card, CardContent, Box,
  Container, IconButton, Tooltip,
  LinearProgress, CircularProgress, Snackbar, Alert, Button
} from "@mui/material"
import { Search } from "@mui/icons-material";

import { useDashboard } from '../../useContext';
import MetaUrl from '../../components/MetaUrl';
import { postRecogMat, putRecogMat } from "../../api";
import NotRecog from '../../components/modal/NotRecog'
import TableMaterial from '../../components/Table/material'
import FilterMaterial from '../../components/Table/material/Filter'
import Header from '../../components/Header'

export default function Marketing() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [materials_, setMaterials_] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [openDialogNotRecog, setOpenDialogNotRecog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRecog, setFilterRecog] = useState("all")
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { loadingPage, loadData, materials } = useDashboard();

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleCloseDialogNotRecog = () => {
    setOpenDialogNotRecog(false)
  }

  const handleComercializar = async (status) => {
    if (status === 'Não Comercializo') return setOpenDialogNotRecog(true);
    if (selectedMaterials.length === 0) return;

    let aPromises = [];
    const recog = status === 'Comercializo' ? 'CMR' : 'NCM';
    const priceAta = status === 'Comercializo' ? 'FPR' : 'NAP';
    const tecInfo = status === 'Comercializo' ? 'FVL' : 'NAP';
    const { postRecog, putRecog } = selectedMaterials.reduce((acc, material) => {
      const oMaterial = materials_.find((item, idx) => (item.id === material))
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
    showSnackbar(`Materiais marcados como "${status}"`);
    setSelectedMaterials([]);
  }

  const fetchMaterials = async (page, pageSize, filters) => {
    const allMaterials = materials === null ? [] : materials
    const filteredMaterials = allMaterials.filter((material) => {
      const matchesSearch =
        !filters.searchTerm ||
        material.maktx?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        material.matnr?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        material.classDesc?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        material.mfrpn?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        material.mfrnr?.toLowerCase().includes(filters.searchTerm.toLowerCase());

      let matchesStatus = true;

      if (filters.filterRecog === "comercializa") {
        matchesStatus = material.NmReconhecido === "Comercializo";
      } else if (filters.filterRecog === "nao-comercializa") {
        matchesStatus = material.NmReconhecido === "Não Comercializo";
      } else if (filters.filterRecog === "pendente") {
        matchesStatus = material.NmReconhecido !== "Comercializo" && material.NmReconhecido !== "Não Comercializo";
      }

      return matchesSearch && matchesStatus;
    });
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
        filterRecog,
      })
      setMaterials_(result.materials)
      setTotalCount(result.totalCount)
    } catch (error) {
      console.error("Erro ao carregar materiais:", error)
    } finally {
      setLoading(false)
    }
  }, [page, rowsPerPage, searchTerm, filterRecog])

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials])

  useEffect(() => {
    setPage(0)
  }, [searchTerm, filterRecog])
  return (
    <>
      <Header />
      <Box sx={{ p: 2, height: "calc(100vh - 60px)" }}>
        <MetaUrl title="Comercialização - GFEx" description="Comercializar Material" />
        {loadingPage ? (
          <div className="initLoading">
            <CircularProgress disableShrink={loadingPage} />
          </div>
        ) : (
          <Container maxWidth="xl">
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Comercialização
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgb(63, 76, 77)' }} >
                Gerencie quais materiais são comercializados
              </Typography>
            </Box>
            <FilterMaterial
              searchTerm={searchTerm} setSearchTerm={setSearchTerm}
              filterRecog={filterRecog} setFilterRecog={setFilterRecog}
            />
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <NotRecog open={openDialogNotRecog} onClose={() => handleCloseDialogNotRecog()} dataSelected={selectedMaterials} aMaterials={materials_} />

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
                <Box
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 5,
                    backgroundColor: "#fff",
                    paddingY: 2,
                    display: "flex",
                    gap: 2,
                    borderBottom: "1px solid #e2e8f0",
                    mb: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    disabled={selectedMaterials.length === 0}
                    onClick={() => handleComercializar("Comercializo")}
                  >
                    Comercializar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    disabled={selectedMaterials.length === 0}
                    onClick={() => handleComercializar("Não Comercializo")}
                  >
                    Não Comercializar
                  </Button>
                  <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center", ml: 2 }}>
                    {selectedMaterials.length} selecionado(s)
                  </Typography>
                </Box>
                <TableMaterial
                  materials={materials_}
                  selectedMaterials={selectedMaterials} setSelectedMaterials={setSelectedMaterials}
                  totalCount={totalCount}
                  rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage}
                  page={page} setPage={setPage}
                  isMultSelect={true}
                />
              </CardContent>
            </Card>
          </Container>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  )
}
