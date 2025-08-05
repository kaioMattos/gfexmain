import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TablePagination,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Alert,
  Stack,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  ListItemButton,
  Divider,
  Avatar,
} from "@mui/material"
import {
  CheckCircle,
  CloudUpload,
  AttachFile,
  Delete,
  ThumbUp,
  ThumbDown,
  Warning,
  FolderOpen,
  ContentCopy,
  Search,
  Engineering,
  Assignment,
} from "@mui/icons-material"
import { useDashboard } from '../useContext';
import { getTecInfoMaterial } from "../api";


// Dados mockados
const infoMaterials_ = Array.from({ length: 2500 }, (_, i) => ({
  id: i + 1,
  matnr: `MAT${String(i + 1).padStart(6, "0")}`,
  maktx: `Material Técnico ${i + 1}`,
  classDesc: ["Cimento", "Aço", "Madeira", "Cerâmica"][i % 4],
  status: ["Validar", "Validada", "loadPetro"][i % 3],
  // fields: [
  //   { Carac: "Resistência à Compressão", Valor: `${20 + (i % 30)} MPa` },
  //   { Carac: "Densidade", Valor: `${2.1 + (i % 10) * 0.1} g/cm³`},
  //   { Carac: "Absorção de Água", Valor: `${1 + (i % 5)}%`},
  //   { Carac: "Resistência à Flexão", Valor: `${5 + (i % 15)} MPa` },
  //   { Carac: "Módulo de Elasticidade", Valor: `${25000 + (i % 5000)} MPa`},
  //   { Carac: "Coeficiente de Dilatação", Valor: `${8 + (i % 4)} x 10⁻⁶/°C`},
  //   { Carac: "Resistência ao Fogo", Valor: `${60 + (i % 120)} min`},
  //   { Carac: "Condutividade Térmica", Valor: `${0.1 + (i % 20) * 0.01} W/mK`},
  //   { Carac: "pH", Valor: `${7 + (i % 7)}`},
  //   { Carac: "Tempo de Cura", Valor: `${7 + (i % 21)} dias`},
  //   { Carac: "Resistência Química", Valor: ["Excelente", "Boa", "Regular"][i % 3] },
  //   { Carac: "Durabilidade", Valor: `${20 + (i % 30)} anos` },
  // ],
}))

export default function InformacoesTecnicas() {
  const { loadingPage, countIndicators, materials } = useDashboard();
  
  const infoMaterials = materials.filter(item=>(item.NmReconhecido === 'Comercializo'));
  console.log(infoMaterials)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [proposedValues, setProposedValues] = useState({})
  const [attachments, setAttachments] = useState({})
  const [agreements, setAgreements] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Estados para modal de anexos
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false)
  const [currentCharacteristic, setCurrentCharacteristic] = useState("")
  const [replicationModalOpen, setReplicationModalOpen] = useState(false)
  const [selectedFileForReplication, setSelectedFileForReplication] = useState(null)
  const [characteristicsForReplication, setCharacteristicsForReplication] = useState([])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }
const loadDataDetail = async (item) => {
    const infoMaterial = await getTecInfoMaterial({      
      filter: `Nm eq '${item.matnr}'`,
      expand:''
    })
    setSelectedMaterial({
      matnr:item.matnr,
      maktx:item.maktx,
      fields:[
        {Carac:'PartNumber',PosCarac:'998',Valor:'',Classe:item.class},
        {Carac:'Fabricante',PosCarac:'999',Valor:'',Classe:item.class},
        ...infoMaterial
      ], 
      InformacoesTecnicas:item.InformacoesTecnicas
    })

  }
  const handleSelectMaterial = async (material) => {

    loadDataDetail(material);
    // setSelectedMaterial(material);
    // Resetar estados quando selecionar novo material
    setProposedValues({})
    setAttachments({})
    setAgreements({})
  }

  const handleProposedValueChange = (characteristic, value) => {
    setProposedValues((prev) => ({
      ...prev,
      [characteristic]: value,
    }))
  }

  const handleOpenAttachmentModal = (characteristic) => {
    setCurrentCharacteristic(characteristic)
    setAttachmentModalOpen(true)
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      const newFiles = files.map((file) => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
      }))

      setAttachments((prev) => ({
        ...prev,
        [currentCharacteristic]: [...(prev[currentCharacteristic] || []), ...newFiles],
      }))
    }
    setAttachmentModalOpen(false)
  }

  const handleUseExistingFile = (file, sourceCharacteristic) => {
    const newFile = {
      ...file,
      id: Date.now() + Math.random(),
    }

    setAttachments((prev) => ({
      ...prev,
      [currentCharacteristic]: [...(prev[currentCharacteristic] || []), newFile],
    }))
    setAttachmentModalOpen(false)
  }

  const handleRemoveAttachment = (characteristic, fileId) => {
    setAttachments((prev) => ({
      ...prev,
      [characteristic]: prev[characteristic]?.filter((file) => file.id !== fileId) || [],
    }))
  }

  const handleAgree = (characteristic) => {
    setAgreements((prev) => ({
      ...prev,
      [characteristic]: "agree",
    }))
    // Limpar proposta e anexos se existir
    if (proposedValues[characteristic]) {
      const newValues = { ...proposedValues }
      delete newValues[characteristic]
      setProposedValues(newValues)
    }
    if (attachments[characteristic]) {
      const newAttachments = { ...attachments }
      delete newAttachments[characteristic]
      setAttachments(newAttachments)
    }
  }

  const handleDisagree = (characteristic) => {
    setAgreements((prev) => ({
      ...prev,
      [characteristic]: "disagree",
    }))
  }

  const handleOpenReplicationModal = (file, sourceCharacteristic) => {
    setSelectedFileForReplication({ ...file, sourceCharacteristic })

    const characteristicsWithProposals = Object.keys(proposedValues).filter((char) => proposedValues[char])
    const characteristicsWithoutThisFile = characteristicsWithProposals.filter((char) => {
      const charFiles = attachments[char] || []
      return !charFiles.some((f) => f.name === file.name)
    })

    setCharacteristicsForReplication(characteristicsWithoutThisFile)
    setReplicationModalOpen(true)
  }

  const handleReplicateFile = () => {
    if (!selectedFileForReplication) return

    characteristicsForReplication.forEach((characteristic) => {
      const newFile = {
        ...selectedFileForReplication,
        id: Date.now() + Math.random(),
      }

      setAttachments((prev) => ({
        ...prev,
        [characteristic]: [...(prev[characteristic] || []), newFile],
      }))
    })

    setReplicationModalOpen(false)
    setSelectedFileForReplication(null)
    setCharacteristicsForReplication([])
  }

  const handleSubmitProposal = () => {
    alert("Avaliação enviada com sucesso!")
    // Resetar estados após envio
    setProposedValues({})
    setAttachments({})
    setAgreements({})
  }

  // Filtrar materiais
  const filteredMaterials = infoMaterials.filter((material) => {
    const matchesSearch =
      material.maktx.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.matnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.classDesc.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || material.InformacoesTecnicas === statusFilter

    return matchesSearch && matchesStatus
  })

  const paginatedMaterials = filteredMaterials.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Verificar se todas as características foram validadas
  const totalCharacteristics = selectedMaterial?.fields?.length || 0
  const validatedCharacteristics = Object.keys(agreements).length
  const allValidated = validatedCharacteristics === totalCharacteristics

  // Características que precisam de anexo
  const characteristicsNeedingAttachment = Object.keys(proposedValues).filter(
    (char) => proposedValues[char] && (!attachments[char] || attachments[char].length === 0),
  )

  // Obter todos os arquivos existentes
  const getAllExistingFiles = () => {
    const allFiles = []
    Object.keys(attachments).forEach((characteristic) => {
      if (attachments[characteristic]) {
        attachments[characteristic].forEach((file) => {
          allFiles.push({ ...file, characteristic })
        })
      }
    })
    return allFiles
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Validada":
        return "success"
      case "loadPetro":
        return "error"
      case "Validar":
        return "warning"
      default:
        return "default"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "Validada":
        return "Aprovado"
      case "loadPetro":
        return "Em Validação Petro"
      case "Validar":
        return "Pendente"
      default:
        return "Pendente"
    }
  }

  const getCategoryIcon = (classDesc) => {
    switch (classDesc) {
      case "Cimento":
        return "🏗️"
      case "Aço":
        return "⚙️"
      case "Madeira":
        return "🌳"
      case "Cerâmica":
        return "🏺"
      default:
        return "📦"
    }
  }

  return (
      <Box sx={{ p: 2, height: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          {/* <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Informações Técnicas
          </Typography> */}
          <Typography variant="body2" color="text.secondary">
            Revise e aprove as informações técnicas dos materiais
          </Typography>
        </Box>

        {/* Master-Detail Layout */}
        <Box sx={{ display: "flex", gap: 2, flex: 1, minHeight: 0 }}>
          {/* MASTER - Lista de Materiais */}
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

              {/* Filtros Compactos */}
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

            {/* Lista de Materiais */}
            <Box sx={{ flex: 1, overflow: "auto" }}>
              <List dense sx={{ py: 0 }}>
                {paginatedMaterials.map((material) => (
                  <ListItem key={material.id} disablePadding>
                    <ListItemButton
                      selected={selectedMaterial?.id === material.id}
                      onClick={() => handleSelectMaterial(material)}
                      sx={{
                        py: 1,
                        px: 2,
                        "&.Mui-selected": {
                          bgcolor: "primary.50",
                          borderRight: "3px solid",
                          borderRightColor: "primary.main",
                        },
                      }}
                    >              
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight="medium" noWrap sx={{ fontSize: "0.875rem" }}>
                            {material.maktx}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary" fontFamily="monospace" display="block">
                              {material.matnr}
                            </Typography>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                              <Chip
                                label={material.classDesc}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.65rem", height: 18 }}
                              />
                              <Chip
                                label={getStatusText(material.InformacoesTecnicas)}
                                color={getStatusColor(material.InformacoesTecnicas)}
                                size="small"
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

            {/* Paginação Compacta */}
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

          {/* DETAIL - Características do Material */}
          <Card sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0}}>
            {selectedMaterial ? (
              <>
                {/* Header Compacto */}
                <CardContent sx={{ pb: 0.5 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {selectedMaterial.maktx}
                      </Typography>
                    </Box>
                    <Chip
                      label={getStatusText(selectedMaterial.InformacoesTecnicas)}
                      color={getStatusColor(selectedMaterial.InformacoesTecnicas)}
                      size="medium"
                    />
                  </Box>

                  
                </CardContent>

                <Divider />

                {/* Lista de Características Compacta */}
                <Box sx={{ flex: 1, overflow: "auto", p: 1.5 }}>

                  <Grid container spacing={1.5}>
                    {selectedMaterial.fields.map((char, index) => {
                      const agreement = agreements[char.Carac]
                      const hasProposal = proposedValues[char.Carac]
                      const hasAttachment = attachments[char.Carac]?.length > 0

                      return (
                        <Grid item xs={12} xl={6} key={index}>
                          <Card
                            variant="outlined"
                            sx={{
                              transition: "all 0.2s ease",
                              border:
                                agreement === "agree"
                                  ? "2px solid #66bb6a"
                                  : agreement === "disagree"
                                    ? "2px solid #ef5350"
                                    : "1px solid #e0e0e0",
                              bgcolor:
                                agreement === "agree"
                                  ? "#e8f5e8"
                                  : agreement === "disagree"
                                    ? "#ffebee"
                                    : "background.paper",
                              "&:hover": { boxShadow: 1 },
                            }}
                          >
                            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 0.5 } }}>
                              <Typography variant="body2" gutterBottom color="primary.main" noWrap>
                                {char.Carac}
                              </Typography>

                              {/* Valor Atual Compacto */}
                              <Box
                                sx={{
                                  mb: 1.5,
                                  p: 1,
                                  // background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                                  borderRadius: 1,
                                  // textAlign: "center",
                                }}
                              >
                                {/* <Typography variant="caption" color="text.secondary" display="block">
                                  Atual
                                </Typography> */}
                                <Typography variant="caption" fontWeight="bold" color="primary.main">
                                  {char.Valor === '' ? 'N/A' : char.Valor}
                                </Typography>
                                
                              </Box>

                              {/* Botões Compactos */}
                              <Stack direction="row" spacing={0.5} sx={{ mb: 1.5 }}>
                                <Button
                                  variant={agreement === "agree" ? "contained" : "outlined"}
                                  color="success"
                                  size="small"
                                  startIcon={<ThumbUp sx={{ fontSize: 14 }} />}
                                  onClick={() => handleAgree(char.Carac)}
                                  sx={{ flex: 1, fontSize: "0.7rem", py: 0.5 }}
                                >
                                  OK
                                </Button>
                                <Button
                                  variant={agreement === "disagree" ? "contained" : "outlined"}
                                  color="error"
                                  size="small"
                                  startIcon={<ThumbDown sx={{ fontSize: 14 }} />}
                                  onClick={() => handleDisagree(char.Carac)}
                                  sx={{ flex: 1, fontSize: "0.7rem", py: 0.5 }}
                                >
                                  Não
                                </Button>
                              </Stack>

                              {/* Campo de Proposta Compacto */}
                              {agreement === "disagree" && (
                                <Box
                                  sx={{
                                    p: 1,
                                    bgcolor: "#fff3e0",
                                    borderRadius: 1,
                                    border: "1px dashed #ff9800",
                                    mb: 1,
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    color="#e65100"
                                    fontWeight="bold"
                                    display="block"
                                    gutterBottom
                                  >
                                    💡 Novo Valor:
                                  </Typography>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    placeholder={char.Valor}
                                    value={proposedValues[char.Carac] || ""}
                                    onChange={(e) => handleProposedValueChange(char.Carac, e.target.value)}
                                   
                                  />

                                  {/* Anexo Compacto */}
                                  {hasProposal && (
                                    <Box sx={{ mt: 1 }}>
                                      <Button
                                        variant="outlined"
                                        startIcon={<CloudUpload sx={{ fontSize: 14 }} />}
                                        size="small"
                                        fullWidth
                                        onClick={() => handleOpenAttachmentModal(char.Carac)}
                                        sx={{
                                          color: "#ff9800",
                                          borderColor: "#ff9800",
                                          fontSize: "0.7rem",
                                          py: 0.5,
                                        }}
                                      >
                                        Anexar
                                      </Button>

                                      {/* Lista de anexos compacta */}
                                      {hasAttachment && (
                                        <Box sx={{ mt: 0.5 }}>
                                          {attachments[char.Carac].map((file) => (
                                            <Box
                                              key={file.id}
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                p: 0.5,
                                                bgcolor: "white",
                                                borderRadius: 0.5,
                                                mt: 0.5,
                                              }}
                                            >
                                              <Box display="flex" alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                                                <AttachFile sx={{ mr: 0.5, color: "#ff9800", fontSize: 12 }} />
                                                <Typography variant="caption" noWrap>
                                                  {file.name}
                                                </Typography>
                                              </Box>
                                              <Box>
                                                <IconButton
                                                  size="small"
                                                  color="secondary"
                                                  onClick={() => handleOpenReplicationModal(file, char.Carac)}
                                                  sx={{ p: 0.25 }}
                                                >
                                                  <ContentCopy sx={{ fontSize: 12 }} />
                                                </IconButton>
                                                <IconButton
                                                  size="small"
                                                  color="error"
                                                  onClick={() => handleRemoveAttachment(char.Carac, file.id)}
                                                  sx={{ p: 0.25 }}
                                                >
                                                  <Delete sx={{ fontSize: 12 }} />
                                                </IconButton>
                                              </Box>
                                            </Box>
                                          ))}
                                        </Box>
                                      )}
                                    </Box>
                                  )}
                                </Box>
                              )}

                              {/* Status Compacto */}
                              {/* {agreement && (
                                <Alert
                                  severity={agreement === "agree" ? "success" : "warning"}
                                  sx={{ py: 0.5 }}
                                  icon={
                                    agreement === "agree" ? (
                                      <CheckCircle sx={{ fontSize: 16 }} />
                                    ) : (
                                      <Warning sx={{ fontSize: 16 }} />
                                    )
                                  }
                                >
                                  <Typography variant="caption">
                                    {agreement === "agree"
                                      ? "✅ Aprovado"
                                      : hasProposal
                                        ? hasAttachment
                                          ? `✅ ${proposedValues[char.Carac]} `
                                          : `⚠️ ${proposedValues[char.Carac]}  (anexo)`
                                        : "⚠️ Aguardando valor"}
                                  </Typography>
                                </Alert>
                              )} */}
                            </CardContent>
                          </Card>
                        </Grid>
                      )
                    })}
                  </Grid>
                </Box>

                {/* Footer Compacto */}
                <Divider />
                <CardContent sx={{ py: 0.5 }}>
                  {/* Alerta compacto */}
                  {characteristicsNeedingAttachment.length > 0 && (
                    <Alert severity="warning" sx={{ mb: 0.5, py: 0.5 }}>
                      <Typography variant="caption" fontWeight="bold">
                        📎 {characteristicsNeedingAttachment.length} característica(s) precisam de anexo
                      </Typography>
                    </Alert>
                  )}

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      📊 {validatedCharacteristics}/{totalCharacteristics} • {Object.keys(proposedValues).length}{" "}
                      propostas
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleSubmitProposal}
                      disabled={!allValidated || characteristicsNeedingAttachment.length > 0}
                      size="small"
                      sx={{ minWidth: 140, fontSize: "0.8rem" }}
                    >
                      {!allValidated
                        ? `⏳ Avaliar (${totalCharacteristics - validatedCharacteristics})`
                        : characteristicsNeedingAttachment.length > 0
                          ? `📎 Anexar (${characteristicsNeedingAttachment.length})`
                          : "💾 Enviar"}
                    </Button>
                  </Box>
                </CardContent>
              </>
            ) : (
              // Estado vazio compacto
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  textAlign: "center",
                  p: 3,
                }}
              >
                <Engineering sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Selecione um Material
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Escolha um material da lista para avaliar suas características técnicas.
                </Typography>
              </Box>
            )}
          </Card>
        </Box>

        {/* Modal de Seleção de Anexo */}
        <Dialog open={attachmentModalOpen} onClose={() => setAttachmentModalOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FolderOpen color="primary" />
              Anexar Arquivo para: {currentCharacteristic}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              {/* Novo Arquivo */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: "100%", p: 2 }}>
                  <Typography variant="h6" gutterBottom color="primary.main">
                    📤 Novo Arquivo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Fazer upload de um novo arquivo
                  </Typography>
                  <Button variant="contained" component="label" startIcon={<CloudUpload />} fullWidth sx={{ mt: 2 }}>
                    Selecionar Arquivo
                    <input
                      type="file"
                      hidden
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                      onChange={handleFileUpload}
                    />
                  </Button>
                </Card>
              </Grid>

              {/* Arquivos Existentes */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: "100%", p: 2 }}>
                  <Typography variant="h6" gutterBottom color="secondary.main">
                    🔄 Reutilizar Arquivo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Usar arquivo já anexado em outra característica
                  </Typography>

                  {getAllExistingFiles().length > 0 ? (
                    <List dense sx={{ maxHeight: 200, overflow: "auto", mt: 1 }}>
                      {getAllExistingFiles().map((file, index) => (
                        <ListItem
                          key={index}
                          button
                          onClick={() => handleUseExistingFile(file, file.characteristic)}
                          sx={{
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                            mb: 1,
                            "&:hover": {
                              bgcolor: "action.hover",
                            },
                          }}
                        >
                          <ListItemIcon>
                            <AttachFile color="secondary" />
                          </ListItemIcon>
                          <ListItemText primary={file.name} secondary={`De: ${file.characteristic}`} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Nenhum arquivo disponível para reutilização
                    </Alert>
                  )}
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAttachmentModalOpen(false)}>Cancelar</Button>
          </DialogActions>
        </Dialog>

        {/* Modal de Replicação */}
        <Dialog open={replicationModalOpen} onClose={() => setReplicationModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ContentCopy color="primary" />
              Replicar Arquivo
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              <strong>Arquivo:</strong> {selectedFileForReplication?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Selecione as características que também precisam deste arquivo:
            </Typography>

            {characteristicsForReplication.length > 0 ? (
              <List>
                {Object.keys(proposedValues)
                  .filter((char) => proposedValues[char])
                  .map((characteristic) => {
                    const hasThisFile = attachments[characteristic]?.some(
                      (f) => f.name === selectedFileForReplication?.name,
                    )
                    if (hasThisFile) return null

                    return (
                      <ListItem key={characteristic} dense>
                        <ListItemIcon>
                          <Checkbox
                            checked={characteristicsForReplication.includes(characteristic)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCharacteristicsForReplication((prev) => [...prev, characteristic])
                              } else {
                                setCharacteristicsForReplication((prev) => prev.filter((c) => c !== characteristic))
                              }
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={characteristic} />
                      </ListItem>
                    )
                  })}
              </List>
            ) : (
              <Alert severity="info">
                Todas as características com propostas já possuem este arquivo ou não há características elegíveis.
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReplicationModalOpen(false)}>Cancelar</Button>
            <Button
              onClick={handleReplicateFile}
              variant="contained"
              disabled={characteristicsForReplication.length === 0}
            >
              Replicar para {characteristicsForReplication.length} característica(s)
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    
  )
}
