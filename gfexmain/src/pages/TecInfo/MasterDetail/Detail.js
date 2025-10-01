import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Grid,
  TextField,
  Stack,
  Divider,
  Tooltip
} from "@mui/material"
import {
  AttachFile,
  Delete,
  ThumbUp,
  ThumbDown,
  Engineering,
} from "@mui/icons-material";
import AutoCompleteInfoTec from '../../../components/modal/AutoCompleteInfoTec';

import { useDashboard } from '../../../useContext';
import { putInfoTecCaracMain, postInfoTecMain, postInfoTecCarac, putRecogMat, postExclusivityLetter } from '../../../api';
import { getDateNow } from '../../../utils';

export default function DetailPage({
  setAttachmentModalOpen,
  setCurrentCharacteristic,
  proposedValues, setProposedValues,
  attachments, setAttachments,
  agreements, setAgreements
}) {
  const { selectedMaterialsMastDet, setFieldValueMatSelect, loadData } = useDashboard();

  const handleProposedValueChange = (characteristic, value) => {
    const oValue = selectedMaterialsMastDet.fields
      .filter((item) => item.Carac === characteristic.Carac && item.PosCarac === characteristic.PosCarac)[0]
    oValue['NovoValor'] = value
    setFieldValueMatSelect(oValue);

    setProposedValues((prev) => ({
      ...prev,
      [characteristic.Carac]: value,
    }))
  }

  const handleOpenAttachmentModal = (characteristic) => {
    setCurrentCharacteristic(characteristic)
    setAttachmentModalOpen(true)
  }
  const handleRemoveAttachment = (characteristic, fileId) => {
    setAttachments((prev) => ({
      ...prev,
      [characteristic]: prev[characteristic]?.filter((file) => file.id !== fileId) || [],
    }))
  }
  const handleAgree = (oCarac) => {
    setAgreements((prev) => ({
      ...prev,
      [oCarac.Carac]: "agree",
    }))
    // Limpar proposta e anexos se existir
    if (proposedValues[oCarac.Carac]) {
      const newValues = { ...proposedValues }
      delete newValues[oCarac.Carac]
      setProposedValues(newValues)
    }
    if (attachments[oCarac.Carac]) {
      const newAttachments = { ...attachments }
      delete newAttachments[oCarac.Carac]
      setAttachments(newAttachments)
    }
    const oValue = selectedMaterialsMastDet.fields
      .filter((item) => item.PosCarac === oCarac.PosCarac)[0];
    oValue['Agreed'] = true;
    setFieldValueMatSelect(oValue);
  }

  const handleDisagree = (oCarac) => {
    setAgreements((prev) => ({
      ...prev,
      [oCarac.Carac]: "disagree",
    }));
    const oValue = selectedMaterialsMastDet.fields
      .filter((item) => item.PosCarac === oCarac.PosCarac)[0];
    oValue['Agreed'] = false;
    setFieldValueMatSelect(oValue);
  }
  const getCaracFromPosCarac = (PosCarac)=>{
    return selectedMaterialsMastDet.fields.find((item)=>item.PosCarac === PosCarac).Carac
  }
  const returnOdocumentFormData = (item) => {
  const material = item.data;
  const field = material.NomeCaracDm !== '' ? material.NomeCaracDm : getCaracFromPosCarac(material.PosCarac);
  const findedAttach = attachments[field]?.[0];

  if (!findedAttach || !findedAttach.file) {
    console.warn("Arquivo não encontrado ou incompleto:", findedAttach);
    return null;
  }

  const formData = new FormData();
  formData.append('IdItemModificacao', material.IdItemModificacao);
  // formData.append('file_name', findedAttach.name);
  // formData.append('mime_type', findedAttach.type);
  formData.append('file', findedAttach.file);
  formData.append('typeFile', 'FileInfoTec');

  return formData;
};


  const handleSubmitProposal = async () => {
    const status = selectedMaterialsMastDet.fields.every((item) => (item.Agreed)) ? 'VLD' : 'AAP'
    const oEntryMain = {
      "Nm": selectedMaterialsMastDet.matnr,
      "Classe": selectedMaterialsMastDet.class,
      "NroPecaFabricante": selectedMaterialsMastDet.mfrpn,
      "Fabricante": selectedMaterialsMastDet.mfrnr,
      "Status": status,
    };
    const oEntryReconhecimento = {
      "Nm": selectedMaterialsMastDet.matnr,
      "InformacoesTecnicas": status
    };
    let aPromises = [];
    let IdModificacao = '';
    try {
      if (selectedMaterialsMastDet.IdModificacao) {
        const mainInfoUpdated = await putInfoTecCaracMain({
          IdModificacao: selectedMaterialsMastDet.IdModificacao,
          AtualizadoEm: getDateNow(),
          ...oEntryMain
        });
        IdModificacao = selectedMaterialsMastDet.IdModificacao
      } else {
        const mainInfoCreated = await postInfoTecMain(oEntryMain);
        IdModificacao = mainInfoCreated.data.IdModificacao;
      }
      // aPromises.push(...oEntryMain.map((oEntry) => (postInfoTecMain(oEntry))));
      // const resolvedPromises = await Promise.all(aPromises);
      const oEntryCarac = selectedMaterialsMastDet.fields
        // .filter((item) => (item.hasOwnProperty('NovoValor') && item.NovoValor !== ''))
        .map((item) => (
          {

            "IdModificacao": IdModificacao,
            "PosCarac": (item.Carac === 'PartNumber' || item.Carac === 'Fabricante') ? '' : item.PosCarac,
            "PosValor": (item.Carac === 'PartNumber' || item.Carac === 'Fabricante') ? '' :
              item.Agreed ? item.PosValor : item.NovoValor,
            "Concorda": item.Agreed,
            "DadoMestre": (item.Carac === 'PartNumber' || item.Carac === 'Fabricante') ? true : false,
            "NomeCaracDm": (item.Carac === 'PartNumber' || item.Carac === 'Fabricante') ? item.Carac : '',
            "ValorCaracDm": (item.Carac === 'PartNumber' || item.Carac === 'Fabricante') ? item.NovoValor : ''
          }));

      const caracPromises = oEntryCarac.map((oEntry) => postInfoTecCarac(oEntry));
      const caracResponses = await Promise.all(caracPromises);
      console.log(caracResponses)
      const oEntryDocuments = caracResponses.filter((mat)=>(!mat.data.Concorda))
      .map(returnOdocumentFormData)

      const aPromiseExclusivityLetter = oEntryDocuments.map((oEntry) => (postExclusivityLetter(oEntry)))
      
      aPromises.push(putRecogMat(oEntryReconhecimento));
    } catch (e) {

    } finally {
      await loadData();
    }
    setProposedValues({})
    setAttachments({})
    setAgreements({})
  }

  // Verificar se todas as características foram validadas
  const totalCharacteristics = selectedMaterialsMastDet?.fields?.length || 0
  const validatedCharacteristics = Object.keys(agreements).length
  const allValidated = validatedCharacteristics === totalCharacteristics

  // Características que precisam de anexo
  const characteristicsNeedingAttachment = Object.keys(proposedValues).filter(
    (char) => proposedValues[char] && (!attachments[char] || attachments[char].length === 0),
  )

  // 1. Verifica se todas as características estão validadas (todas concordam ou discordam)
  const allCharacteristicsValidated = selectedMaterialsMastDet.fields.length > 0 &&
    selectedMaterialsMastDet.fields.every(({ Carac }) => agreements[Carac] !== undefined);

  // 2. Verifica se todas concordaram (todas com "agree")
  const allAgreed = selectedMaterialsMastDet.fields.length > 0 &&
    selectedMaterialsMastDet.fields.every(({ Carac }) => agreements[Carac] === "agree");

  // 3. Pega as características discordadas
  const disagreedChars = Object.entries(agreements)
    .filter(([_, value]) => value === "disagree")
    .map(([char]) => char);

  // 4. Verifica se para todas discordadas tem proposta e anexo
  const allDisagreedHaveProposalAndAttachment = disagreedChars.every((char) =>
    proposedValues[char] && attachments[char] && attachments[char].length > 0
  );

  // 5. Habilitar botão enviar se todas concordaram OU se discordou mas propostas + anexos ok
  const enableSend = allCharacteristicsValidated && (allAgreed || allDisagreedHaveProposalAndAttachment);


  return (
    <Card sx={{
      flex: 1, display: "flex", flexDirection: "column", minWidth: 0,
      border: '1px solid',
      borderColor: selectedMaterialsMastDet ? selectedMaterialsMastDet.InformacoesTecnicas === 'Validada' ? "success.light" :
        selectedMaterialsMastDet.InformacoesTecnicas === 'Não Aplicável' ? "greyInfo.light" :
          selectedMaterialsMastDet.InformacoesTecnicas === 'Validar' ? "warning.main" :
            selectedMaterialsMastDet.InformacoesTecnicas === 'Aguardando Avaliação Petrobrás'
              ? "info.light" : "" : "gray",
    }}>
      {!!selectedMaterialsMastDet.fields.length ? (
        <>
          <CardContent sx={{
            p: '12px 12px 4px',
            bgcolor:
              selectedMaterialsMastDet.InformacoesTecnicas === 'Validada' ? "success.light" :
                selectedMaterialsMastDet.InformacoesTecnicas === 'Não Aplicável' ? "greyInfo.light" :
                  selectedMaterialsMastDet.InformacoesTecnicas === 'Validar' ? "warning.main" :
                    selectedMaterialsMastDet.InformacoesTecnicas === 'Aguardando Avaliação Petrobrás'
                      ? "info.light" : "",
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" color="white" noWrap>
                  {selectedMaterialsMastDet.matnr} - {selectedMaterialsMastDet.maktx}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 0, flex: 1, textAlign: 'end' }}>
                <Typography variant="body2" color="white" noWrap>
                  {selectedMaterialsMastDet.InformacoesTecnicas}
                </Typography>
              </Box>
            </Box>
          </CardContent>
          <Divider />

          <Box sx={{ flex: 1, overflow: "auto", p: 1.5 }}>
            {selectedMaterialsMastDet.InformacoesTecnicas === 'Validar' && (
              <Box display="flex" justifyContent="flex-end" gap={1} mb={1}>
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  onClick={() => {
                    const allAgreements = {}
                    selectedMaterialsMastDet.fields.forEach((f) => {
                      allAgreements[f.Carac] = "agree"
                    })
                    setAgreements(allAgreements);
                    selectedMaterialsMastDet.fields
                      .map((item) => (setFieldValueMatSelect({ ...item, Agreed: true })));
                  }}
                >
                  ✅ Concordar com Todos
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    const allDisagreements = {}
                    selectedMaterialsMastDet.fields.forEach((f) => {
                      allDisagreements[f.Carac] = "disagree"
                    })
                    setAgreements(allDisagreements);
                    selectedMaterialsMastDet.fields
                      .map((item) => (setFieldValueMatSelect({ ...item, Agreed: false })));
                  }}
                >
                  ❌ Discordar de Todos
                </Button>
              </Box>
            )}


            <Grid container spacing={1.5} wrap="wrap">
              {selectedMaterialsMastDet.fields.map((char, index) => {
                const agreement = agreements[char.Carac];
                const hasProposal = proposedValues[char.Carac];
                const hasAttachment = attachments[char.Carac]?.length > 0;

                return (
                  <Grid
                    item
                    key={index}
                    sx={{
                      flexGrow: 1,
                      flexBasis: "350px",   // Valor mínimo de largura (ajustável)
                      maxWidth: "100%",     // Não ultrapassa a largura total
                    }}
                  >

                    {selectedMaterialsMastDet.InformacoesTecnicas === 'Validar' ? (

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
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          minWidth: 350, // Tamanho mínimo do card
                        }}
                      >
                        <CardContent
                          sx={{
                            p: 1.5,
                            "&:last-child": { pb: 0.5 },
                            minHeight: 200,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            {/* Título + botões */}
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="body2" fontWeight="bold" color="primary.main" noWrap>
                                {char.Carac}
                              </Typography>
                              <Stack direction="row" spacing={0.5}>
                                <Tooltip title="Concordar com o valor">
                                  <Button
                                    variant={agreement === "agree" ? "contained" : "outlined"}
                                    color="success"
                                    size="small"
                                    onClick={() => handleAgree(char)}
                                    sx={{ fontSize: "0.7rem", py: 0.5 }}
                                  >
                                    <ThumbUp sx={{ fontSize: 16, mr: 0.5 }} /> OK
                                  </Button>
                                </Tooltip>

                                <Tooltip title="Discordar do valor">
                                  <Button
                                    variant={agreement === "disagree" ? "contained" : "outlined"}
                                    color="error"
                                    size="small"
                                    onClick={() => handleDisagree(char)}
                                    sx={{ fontSize: "0.7rem", py: 0.5 }}
                                  >
                                    <ThumbDown sx={{ fontSize: 16, mr: 0.5 }} /> Não
                                  </Button>
                                </Tooltip>
                              </Stack>
                            </Box>

                            {/* Valor antigo com fonte menor */}
                            <Typography
                              variant="caption"
                              fontWeight="medium"
                              color="primary.main"
                            >
                              {char.Valor === '' ? 'N/A' : char.Valor}
                            </Typography>

                            {/* Proposta ou status */}
                            <Box sx={{ mt: 1 }}>
                              {agreement === "disagree" ? (
                                <Box
                                  sx={{
                                    p: 1,
                                    bgcolor: "#fff3e0",
                                    borderRadius: 1,
                                    border: "1px dashed #ff9800",
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    color="#e65100"
                                    fontWeight="bold"
                                    display="block"
                                    gutterBottom
                                  >
                                    💡 Proposta de novo valor:
                                  </Typography>

                                  <Box display="flex" gap={1} alignItems="center">
                                    {char.Carac === 'PartNumber' || char.Carac === 'Fabricante' ? (
                                      <TextField
                                        size="small"
                                        value={proposedValues[char.Carac] || ""}
                                        onChange={(e) => handleProposedValueChange(char, e.target.value)}
                                        sx={{
                                          mb: 1,
                                          flexGrow: 1,
                                        }}
                                      />) : (<AutoCompleteInfoTec data={char} eChange={handleProposedValueChange} />)}


                                    <Tooltip title={hasProposal ? "Clique para anexar um arquivo" : "Adicione um valor proposto para habilitar o anexo"}>
                                      <span>
                                        <IconButton
                                          color="warning"
                                          onClick={() => hasProposal && handleOpenAttachmentModal(char.Carac)}
                                          disabled={!hasProposal}
                                          sx={{
                                            bgcolor: hasProposal ? "#fff8e1" : "transparent",
                                            border: "1px solid",
                                            borderColor: hasProposal ? "#ff9800" : "rgba(0, 0, 0, 0.12)",
                                            cursor: hasProposal ? "pointer" : "not-allowed",
                                            width: 42,
                                            height: 42,
                                          }}
                                        >
                                          <AttachFile sx={{ fontSize: 20 }} />
                                        </IconButton>
                                      </span>
                                    </Tooltip>
                                  </Box>

                                  {/* Anexos */}
                                  {hasAttachment && (
                                    <Box sx={{ mt: 1 }}>
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

                                            <Tooltip title="Remover anexo">
                                              <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleRemoveAttachment(char.Carac, file.id)}
                                                sx={{ p: 0.25 }}
                                              >
                                                <Delete sx={{ fontSize: 12 }} />
                                              </IconButton>
                                            </Tooltip>
                                          </Box>
                                        </Box>
                                      ))}
                                    </Box>
                                  )}
                                </Box>
                              ) : (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ fontStyle: "italic", mt: 1, textAlign: 'center' }}
                                >
                                  {agreement === "agree"
                                    ? "✅ Valor validado."
                                    : "⚠️ Nenhuma avaliação feita ainda."}
                                </Typography>
                              )}
                            </Box>


                          </Box>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card
                        variant="outlined"
                        sx={{
                          transition: "all 0.2s ease",

                          "&:hover": { boxShadow: 1 },
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          minWidth: 350, // Tamanho mínimo do card
                        }}
                      >
                        <CardContent
                          sx={{
                            p: 1.5,
                            "&:last-child": { pb: 0.5 },
                            minHeight: 100,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="body2" fontWeight="bold" color="primary.main" noWrap>
                                {char.Carac}
                              </Typography>

                            </Box>
                            {/* Valor antigo com fonte menor */}
                            <Typography
                              variant="caption"
                              fontWeight="medium"
                              color="primary.main"
                            >
                              {char.Valor === '' ? 'N/A' : char.Valor}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    )}
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          {/* Footer Compacto */}
          <Divider />
          {selectedMaterialsMastDet.InformacoesTecnicas === 'Validar' && (
            <CardContent sx={{ py: 0.7 }} visibility={selectedMaterialsMastDet.InformacoesTecnicas === 'Validar' ? true : false}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={1}
              >
                {/* Indicador de características validadas */}
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  📊 {validatedCharacteristics}/{totalCharacteristics}
                </Typography>

                {/* Mensagem de anexo centralizada, aparece apenas se necessário */}
                <Box sx={{ flex: 1, textAlign: "center" }} >
                  {characteristicsNeedingAttachment.length > 0 && (
                    <Typography
                      variant="caption"
                      color="warning.main"
                      fontWeight="bold"
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      📎 {characteristicsNeedingAttachment.length} característica(s) precisam de anexo
                    </Typography>
                  )}
                </Box>

                <Button
                  variant="contained"
                  onClick={handleSubmitProposal}
                  disabled={!enableSend}
                  size="small"
                  sx={{ minWidth: 140, fontSize: "0.8rem", whiteSpace: 'nowrap' }}
                >
                  {!allCharacteristicsValidated
                    ? `⏳ Avaliar (${selectedMaterialsMastDet.fields.length - Object.keys(agreements).length})`
                    : disagreedChars.length > 0 && !allDisagreedHaveProposalAndAttachment
                      ? `📎 Anexar arquivo`
                      : "💾 Enviar"
                  }
                </Button>

              </Box>
            </CardContent>
          )}

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
  )
}
