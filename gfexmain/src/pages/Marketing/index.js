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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function Marketing() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
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

    const recog = status === 'Comercializo' ? 'CMR' : 'NCM';
    const priceAta = status === 'Comercializo' ? 'FPR' : 'NAP';
    const tecInfo = status === 'Comercializo' ? 'FVL' : 'NAP';

    // Aqui, usar materials do contexto para garantir dados atualizados
    const { postRecog, putRecog } = selectedMaterials.reduce((acc, materialId) => {
      const oMaterial = materials.find(item => item.id === materialId);
      if (!oMaterial) return acc;

      const oEntry = {
        Nm: oMaterial.matnr,
        DataCriacao: null,
        UsuarioCriador: "EMERSON",
        NmReconhecido: recog,
        AtaPrecoPreenchida: priceAta,
        InformacoesTecnicas: tecInfo
      };

      if (oMaterial.NmReconhecido === 'Falta Identificação') {
        acc.postRecog.push(oEntry);
      } else {
        acc.putRecog.push(oEntry);
      }

      return acc;
    }, { postRecog: [], putRecog: [] });

    const promisesPost = postRecog.map(oEntry => postRecogMat(oEntry));
    const promisesPut = putRecog.map(oEntry => putRecogMat(oEntry));
    await Promise.all([...promisesPost, ...promisesPut]);
    setSelectedMaterials([]);
    await loadData();
    setPage(0);
    showSnackbar(`Materiais marcados como "${status}"`);
  };
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const loadMaterials = useCallback(() => {
    if (!materials || materials.length === 0) {
      setFilteredMaterials([]);
      setTotalCount(0);
      return;
    }
    const filtered = materials.filter((material) => {
      const matchesSearch =
        !searchTerm ||
        material.maktx?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.matnr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.classDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.mfrpn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.mfrnr?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (filterRecog === "comercializa") {
        matchesStatus = material.NmReconhecido === "Comercializo";
      } else if (filterRecog === "nao-comercializa") {
        matchesStatus = material.NmReconhecido === "Não Comercializo";
      } else if (filterRecog === "pendente") {
        matchesStatus = material.NmReconhecido !== "Comercializo" && material.NmReconhecido !== "Não Comercializo";
      }
      return matchesSearch && matchesStatus;
    });

    setTotalCount(filtered.length);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);

    setFilteredMaterials(paginated);

  }, [materials, page, rowsPerPage, searchTerm, filterRecog]);

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  useEffect(() => {
    if (!materials) return; 

    loadMaterials(); 
  }, [materials, page, rowsPerPage, searchTerm, filterRecog]);
const handleDownloadTemplate = () => {
  const wsData = [
    ["Material", "Comercializa"], // Cabeçalhos
    ["123456", "Comercializo"],
    ["789012", "Não Comercializo"]
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Adiciona validação de dados (Combobox) na coluna B
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let row = 1; row <= range.e.r; row++) {
    const cellRef = XLSX.utils.encode_cell({ r: row, c: 1 }); // Coluna B
    if (!ws[cellRef]) ws[cellRef] = { t: 's', v: "" };
    ws[cellRef].s = {};
  }

  ws['!dataValidation'] = [{
    type: 'list',
    allowBlank: false,
    sqref: `B2:B1000`,
    formulas: ['"Comercializo,Não Comercializo"'],
  }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Modelo");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), "modelo_comercializacao.xlsx");
};
const handleImportExcel = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setLoading(true);
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const result = jsonData.map(row => {
      const matnr = String(row.Material).trim();
      const status = String(row.Comercializa).trim();

      if (!matnr || !["Comercializo", "Não Comercializo"].includes(status)) return null;

      return { matnr, status };
    }).filter(Boolean);

    const postRecog = [];
    const putRecog = [];

    result.forEach(({ matnr, status }) => {
      const oMaterial = materials.find(item => item.matnr === matnr);
      if (!oMaterial) return;

      const recog = status === 'Comercializo' ? 'CMR' : 'NCM';
      const priceAta = status === 'Comercializo' ? 'FPR' : 'NAP';
      const tecInfo = status === 'Comercializo' ? 'FVL' : 'NAP';

      const oEntry = {
        Nm: matnr,
        DataCriacao: null,
        UsuarioCriador: "EMERSON",
        NmReconhecido: recog,
        AtaPrecoPreenchida: priceAta,
        InformacoesTecnicas: tecInfo
      };

      if (oMaterial.NmReconhecido === 'Falta Identificação') {
        postRecog.push(oEntry);
      } else {
        putRecog.push(oEntry);
      }
    });

    const promisesPost = postRecog.map(oEntry => postRecogMat(oEntry));
    const promisesPut = putRecog.map(oEntry => putRecogMat(oEntry));

    await Promise.all([...promisesPost, ...promisesPut]);
    await loadData();
    setPage(0);

    showSnackbar("Importação realizada com sucesso!");

  } catch (error) {
    console.error(error);
    showSnackbar("Erro ao importar arquivo", "error");
  }
  setLoading(false);
};


  return (
    <>
      <Header />
      <Box sx={{ p: 2, height: "calc(100vh - 60px)" }}>
        <MetaUrl title="Comercialização - GFEX" description="Comercializar Material" />
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
                  <NotRecog open={openDialogNotRecog} onClose={() => handleCloseDialogNotRecog()} dataSelected={selectedMaterials} aMaterials={materials} />

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
                  <Button variant="outlined" color="primary" onClick={handleDownloadTemplate}>
  Baixar Modelo
</Button>

<Button
  variant="contained"
  component="label"
  color="secondary"
>
  Importar Excel
  <input type="file" hidden accept=".xlsx, .xls" onChange={handleImportExcel} />
</Button>

                </Box>
                <TableMaterial
                  materials={filteredMaterials}
                  selectedMaterials={selectedMaterials}
                  setSelectedMaterials={setSelectedMaterials}
                  totalCount={totalCount}
                  rowsPerPage={rowsPerPage}
                  setRowsPerPage={setRowsPerPage}
                  page={page}
                  setPage={setPage}
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
