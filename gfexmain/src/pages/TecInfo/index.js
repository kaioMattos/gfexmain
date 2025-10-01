import { useState } from "react"
import {
  Box, Card, Typography, Button, Grid, Alert, Checkbox,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, ListItemIcon,
} from "@mui/material"
import {
  CloudUpload, AttachFile, FolderOpen, ContentCopy,
} from "@mui/icons-material";

import MetaUrl from '../../components/MetaUrl';
import MasterPage from './MasterDetail/Master';
import DetailPage from './MasterDetail/Detail'
import Header from '../../components/Header'

export default function TecInfoPage() {

  const [proposedValues, setProposedValues] = useState({})
  const [attachments, setAttachments] = useState({})
  const [agreements, setAgreements] = useState({})

  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false)
  const [currentCharacteristic, setCurrentCharacteristic] = useState("")
  const [replicationModalOpen, setReplicationModalOpen] = useState(false)
  const [selectedFileForReplication, setSelectedFileForReplication] = useState(null)
  const [characteristicsForReplication, setCharacteristicsForReplication] = useState([])

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      const newFiles = files.map((file) => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        file: file, 
        type:file.type
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

  return (
    <>
      <Header />
      <Box sx={{ p: 2, height: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}>
        <MetaUrl title="Informações Técnicas - GFEx" description="Validar Informações Técnicas dos Materiais" />
        <Box sx={{ mb: 2 }}>
          {/* <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Informações Técnicas
          </Typography> */}
          <Typography variant="body2" sx={{ color: 'rgb(0,142,145)' }} >
            Revise e aprove as informações técnicas dos materiais
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, flex: 1, minHeight: 0 }}>
          <MasterPage setProposedValues={setProposedValues} setAttachments={setAttachments} setAgreements={setAgreements} />
          <DetailPage
            setAttachmentModalOpen={setAttachmentModalOpen}
            setCurrentCharacteristic={setCurrentCharacteristic}
            proposedValues={proposedValues} setProposedValues={setProposedValues}
            attachments={attachments} setAttachments={setAttachments}
            agreements={agreements} setAgreements={setAgreements}
          />
        </Box>
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
    </>
  )
}
