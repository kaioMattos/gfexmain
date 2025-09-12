import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TablePagination,
  Chip,
  Button,
  TextField,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
} from "@mui/material"
import {
  Search,
  Engineering,
} from "@mui/icons-material";

import { useDashboard } from '../../../useContext';
import { getTecInfoMaterial, getTecInfoMain } from '../../../api';

export default function MasterPage({setProposedValues,setAttachments, setAgreements}) {
  const { setSelectedMaterialsMastDet, selectedMaterialsMastDet, materials } = useDashboard();

  const infoMaterials = materials.filter(item => (item.NmReconhecido === 'Comercializo'));
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }
  const loadDataDetail = async (item) => {
    const sFilter = `Nm eq '${item.matnr}'`;

    const aResultTecInfoMain = await getTecInfoMain({
      filter: sFilter
    });
    const IdModificacao = !!aResultTecInfoMain.length ? aResultTecInfoMain[0].IdModificacao : false;
    const infoMaterial = await getTecInfoMaterial({
      filter: sFilter,
      expand: ''
    })
    setSelectedMaterialsMastDet({
      IdModificacao: IdModificacao,
      matnr: item.matnr,
      maktx: item.maktx,
      class: item.class,
      mfrnr: item.mfrnr,
      mfrpn: item.mfrpn,
      fields: [
        { Carac: 'PartNumber', PosCarac: '998', Valor: '', Classe: item.class },
        { Carac: 'Fabricante', PosCarac: '999', Valor: '', Classe: item.class },
        ...infoMaterial
      ],
      InformacoesTecnicas: item.InformacoesTecnicas
    })

  }
  const handleSelectMaterial = async (material) => {

    loadDataDetail(material);
    setProposedValues({})
    setAttachments({})
    setAgreements({})
  }

  const filteredMaterials = infoMaterials.filter((material) => {
    const matchesSearch =
      material.maktx.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.matnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.classDesc.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || material.InformacoesTecnicas === statusFilter
    return matchesSearch && matchesStatus
  })

  const paginatedMaterials = filteredMaterials.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Card sx={{ width: 380, display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <CardContent sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: "1.1rem" }}>
            <Engineering color="primary" />
            Materiais
          </Typography>
          <Chip
            label={`${infoMaterials.filter((m) => m.InformacoesTecnicas === "Validar").length}`}
            color="warning"
            size="small"
          />
        </Box>

        <Stack spacing={1.5} mb={1.5}>
          <TextField
            size="small"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} />,
            }}
            sx={{ "& .MuiInputBase-input": { fontSize: "0.875rem" } }}
          />

          <Box display="flex" gap={0.5}>
            <Button
              size="small"
              variant={statusFilter === "all" ? "contained" : "outlined"}
              onClick={() => setStatusFilter("all")}
              sx={{ fontSize: "0.75rem", minWidth: "auto", px: 1 }}
            >
              Todos
            </Button>
            <Button
              size="small"
              variant={statusFilter === "Validar" ? "contained" : "outlined"}
              color="warning"
              onClick={() => setStatusFilter("Validar")}
              sx={{ fontSize: "0.75rem", minWidth: "auto", px: 1 }}
            >
              Pendentes
            </Button>
            <Button
              size="small"
              variant={statusFilter === "Aguardando Avaliação Petrobrás" ? "contained" : "outlined"}
              color="info"
              onClick={() => setStatusFilter("Aguardando Avaliação Petrobrás")}
              sx={{ fontSize: "0.75rem", minWidth: "auto", px: 1 }}
            >
              Em Análise
            </Button>
            <Button
              size="small"
              variant={statusFilter === "Validada" ? "contained" : "outlined"}
              color="success"
              onClick={() => setStatusFilter("Validada")}
              sx={{ fontSize: "0.75rem", minWidth: "auto", px: 1 }}
            >
              Aprovados
            </Button>

          </Box>
        </Stack>
      </CardContent>

      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List dense sx={{ py: 0 }}>
          {paginatedMaterials.map((material) => (
            <ListItem key={material.id} disablePadding>
              <ListItemButton
                selected={selectedMaterialsMastDet?.matnr === material.matnr}
                onClick={() => handleSelectMaterial(material)}
                sx={{
                  py: 1,
                  px: 2,
                  "&.Mui-selected": {
                    border: '1px solid rgb(0, 133, 66)',
                    borderRadius: '4px',

                    backgroundColor: 'rgba(0, 133, 66, 0.09)',
                    '&:hover': {
                      backgroundColor: 'action.selectedHover',
                    },
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                      <Typography variant="body2" fontWeight="medium" noWrap sx={{
                        fontSize: "0.875rem"
                      }}
                      >

                        {material.maktx}
                      </Typography>
                      <Chip
                        size="small"
                        variant="outlined"

                        sx={{
                          fontSize: "0.80rem", bgcolor:
                            material.InformacoesTecnicas === 'Validada' ? "success.light" :
                              material.InformacoesTecnicas === 'Não Aplicável' ? "greyInfo.light" :
                                material.InformacoesTecnicas === 'Validar' ? "warning.main" :
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
                            material.InformacoesTecnicas === 'Aguardando Avaliação Petrobrás' ? 'Em Análise (PETROBRAS)' :
                              material.InformacoesTecnicas} />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Box  >
                        <Typography variant="caption" color="text.secondary" fontFamily="monospace" display="block">
                          {material.matnr}
                        </Typography>

                      </Box>
                      <Box>
                        <Chip
                          label={material.classDesc}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.65rem", height: 18 }}
                        />

                      </Box>
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider />
      <TablePagination
        component="div"
        count={filteredMaterials.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
        labelRowsPerPage=""
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        sx={{
          minHeight: "auto",
          "& .MuiTablePagination-toolbar": { minHeight: 40, px: 1 },
          "& .MuiTablePagination-selectLabel": { fontSize: "0.75rem" },
          "& .MuiTablePagination-displayedRows": { fontSize: "0.75rem" },
        }}
      />
    </Card>
  )
}
