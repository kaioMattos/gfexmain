import React, { useEffect, useState } from 'react';
import CustomDialog from '../../../components/modal/ModalAccess';
import { v4 as uuidv4 } from 'uuid';
import isEqual from 'lodash/isEqual';
import { Grid, Button, TableCell, tableCellClasses, Alert } from '@mui/material';
// import Grid from '@mui/material/Grid2';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { readFile, getDateNowFrontFormated } from '../../../utils';
import { useAuth } from '../../../useContext/AuthContext';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PrimeReactProvider } from 'primereact/api';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

import { VisuallyHiddenInput } from './wizardStepCss';
import dayjs from 'dayjs'; 

// const VisuallyHiddenInput = styled('input')({
//   clip: 'rect(0 0 0 0)',
//   clipPath: 'inset(50%)',
//   height: 1,
//   overflow: 'hidden',
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
//   whiteSpace: 'nowrap',
//   width: 1,
// });

export default function ExclusivityLetterForm() {
  //const { supplier, setExclusivityLetter, setExpiredDate } = useWzdGd();
  const { user, setExclusivityLetter, setExpiredDate, setActiveNext } = useAuth();
  
  console.log("Estado atual de supplier no render:", user); // <--- Adicione esta linha
  console.log("Estado atual de user.infoS4H.exclusivityLetter no render:", user.infoS4H.exclusivityLetter);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogColor, setDialogColor] = useState("success");
  const [dialogIcon, setDialogIcon] = useState("");

  // NOVO useEffect para recalcular o activeNextDisabled
  useEffect(() => {
      console.log("ExclusivityLetterForm useEffect de validação rodou!");
      // Verifica se todas as cartas ativas têm arquivo anexado e data de vencimento preenchida
      const allLettersCompleted = Array.isArray(user.infoS4H.exclusivityLetter) && user.infoS4H.exclusivityLetter.every(
        (item) =>
          item.status && // A carta está ativa
          item.localFile && item.localFile !== '' && // Tem arquivo anexado
          item.expiredDateTime && item.expiredDateTime > 0 // Tem data de vencimento válida (timestamp)
      );
      // shouldDisableNext será true se:
      // 1. Houver cartas e alguma delas não estiver completa (allLettersCompleted é false)
      // 2. Ou se a lista de cartas estiver vazia (nesse caso, o botão de finalizar deve estar desabilitado se não há nada para finalizar)
      // A lógica 'user.infoS4H.exclusivityLetter.length === 0' é importante para o caso de não haver fabricantes, onde o botão 'Finalizar' deveria estar habilitado.
      // Se não há fabricantes, não há cartas de exclusividade para anexar, então a "condição de completude" é naturalmente atendida.
      const shouldDisableNext = !(user.infoS4H.exclusivityLetter.length === 0 || allLettersCompleted);
      
      // Atualiza o estado global SOMENTE se houver uma mudança real para evitar re-renders desnecessários
      if (user.infoS4H.activeNextDisabled !== shouldDisableNext) {
          setActiveNext(shouldDisableNext);
      }
  }, [user.infoS4H.exclusivityLetter, setActiveNext]);

  const addFile = async (files, rowId = null) => {
    const oFile = files[0];
    if (!oFile) {
        console.log("Nenhum arquivo selecionado.");
        return;
    }
    if (oFile.type !== "application/pdf") {
      setDialogMessage("Por favor, selecione apenas arquivos PDF.");
      setDialogColor("red");
      setDialogOpen(true);
      setDialogIcon("error");
      return;
    }
    
    const sFileBase64 = await readFile(oFile);

    const fileAttachmentData = {
      fileName: oFile.name.split('.')[0],
      extension: oFile.name.split('.')[1],
      mediaType: oFile.type,
      uploadState: "Complete",
      revision: "00",
      fileSize: oFile.size,
      updatedAt: getDateNowFrontFormated(new Date(), 'dataAtMinutes'),
      documentType: "ExclusivityLetter",
      newDocument: true,
      localFile: sFileBase64,
      url: "",
      status: true,
      lastModifiedBy: ""
    };

    setExclusivityLetter(prevLetters => {
        // Encontra o índice da carta que corresponde ao rowId
        const currentLetters = Array.isArray(prevLetters) ? prevLetters : [];
        const letterIndex = currentLetters.findIndex(letter => letter.id === rowId);

        if (letterIndex > -1) {
            // Se a carta for encontrada, crie uma nova array com a carta atualizada
            const updatedLetters = [...currentLetters];
            updatedLetters[letterIndex] = {
                ...updatedLetters[letterIndex], // Mantém as propriedades
                ...fileAttachmentData,               // Sobrescreve com os novos dados do arquivo
                // Se a data de expiração já foi preenchida, não a resetar
                expiredDate: updatedLetters[letterIndex].expiredDate || "",
                expiredDateTime: updatedLetters[letterIndex].expiredDateTime || "",
            };
            console.log("addFile: Carta atualizada com anexo:", updatedLetters[letterIndex]);    
            return updatedLetters;
        } else {
          console.warn(`addFile: rowId ${rowId} não encontrado. Nenhum anexo foi aplicado. Verifique a correspondência de IDs.`);
          return currentLetters; // Retorna o estado inalterado
        }
    });
  }

  const handleDateChange = (event, data) => {
    const selectedDate = event; // O próprio 'event' já é o objeto Dayjs
    const expiredTimestamp = selectedDate ? selectedDate.toDate().getTime() : null; // Converte para timestamp
    
    setExpiredDate({ 
        ...data, // Mantém outras propriedades da linha
        expiredDate: selectedDate, // Salva o objeto Dayjs para ser usado na exibição e pré-preenchimento
        expiredDateTime: expiredTimestamp // Salva o timestamp para o cálculo do botão "Próximo"
    });
  }
  const activeLetters = (item) => (item.status);
  useEffect(() => {
    console.log("useEffect rodou!");
    console.log("user.manufacturer dentro do useEffect:", user.infoS4H.manufacturer);
    console.log("user.infoS4H.exclusivityLetter dentro do useEffect:", user.infoS4H.exclusivityLetter);

    const currentManufacturers = Array.isArray(user.infoS4H.manufacturer) ? user.infoS4H.manufacturer : [];
      if (currentManufacturers.length === 0) {
    console.log("Fabricantes ainda não disponíveis.");
    return;
  }
    const activeManufacturers = currentManufacturers.filter(mfg => mfg.status);

    const existingLettersByIdMap = new Map();
    if (Array.isArray(user.infoS4H.exclusivityLetter)) {
        user.infoS4H.exclusivityLetter.forEach(letter => {
            if (letter.id) { // Use letter.id como a chave agora
                existingLettersByIdMap.set(letter.id, letter);
            }
        });
    }
    const activeManufacturersMap = new Map();
    activeManufacturers.forEach(mfg => {
        const uniqueMfgKey = `${mfg.DocumentId}-${mfg.text}`;
        activeManufacturersMap.set(uniqueMfgKey, mfg);
    });

    const newExclusivityLetters = [];
    activeManufacturers.forEach(mfg => {
        const uniqueMfgKey = `${mfg.DocumentId}-${mfg.text}`;

        let foundExistingLetter = null;
        for (const letter of existingLettersByIdMap.values()) {
            if (letter.manufacturerId === mfg.DocumentId && letter.manufacturerName === mfg.text) {
                foundExistingLetter = letter;
                break; // Encontrou, pode sair do loop
            }
        }

        if (foundExistingLetter) {
            newExclusivityLetters.push({
                ...foundExistingLetter, //
                manufacturerName: mfg.text, 
                status: true 
            });

            existingLettersByIdMap.delete(foundExistingLetter.id);
        } else {

            newExclusivityLetters.push({
                id: uuidv4(), 
                manufacturerId: mfg.DocumentId, 
                manufacturerName: mfg.text, 
                fileName: '', 
                extension: '',
                mediaType: '',
                uploadState: "Pending",
                revision: "00",
                fileSize: 0,
                updatedAt: getDateNowFrontFormated(new Date(), 'dataAtMinutes'),
                documentType: "ExclusivityLetter",
                newDocument: true,
                expiredDate: "", // Vazio
                expiredDateTime: "", // Vazio
                localFile: "", // Vazio
                url: "",
                status: true,
                lastModifiedBy: ""
            });
        }
    });

    // A lista final de cartas é simplesmente newExclusivityLetters.
    const finalExclusivityLetters = newExclusivityLetters;

    const currentLetterUniqueKeys = new Set(Array.isArray(user.infoS4H.exclusivityLetter) ? 
        user.infoS4H.exclusivityLetter.map(l => `${l.manufacturerId}-${l.manufacturerName}`) : []);
    const finalLetterUniqueKeys = new Set(finalExclusivityLetters.map(l => `${l.manufacturerId}-${l.manufacturerName}`));

    const needsUpdate = (user.infoS4H.exclusivityLetter ? user.infoS4H.exclusivityLetter.length : 0) !== finalExclusivityLetters.length ||
                        ![...currentLetterUniqueKeys].every(key => finalLetterUniqueKeys.has(key)) ||
                        ![...finalLetterUniqueKeys].every(key => currentLetterUniqueKeys.has(key));

  if (!isEqual(user.infoS4H.exclusivityLetter, finalExclusivityLetters)) {
    setExclusivityLetter(finalExclusivityLetters);
}

  }, [user.infoS4H.manufacturer, setExclusivityLetter, getDateNowFrontFormated]);

  const base64ToBlob = (base64String, contentType = '') => {
    var base64Data = base64String.replace(/^data:([^;]+);base64,/, '');
    var binaryData = atob(base64Data);
    var arrayBuffer = new ArrayBuffer(binaryData.length);
    var uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
    var blob = new Blob([arrayBuffer], { type: contentType || 'application/pdf' });
    return URL.createObjectURL(blob);
  }
  const expiredDateTemplate = (data) => {
    const initialDate = data.expiredDate ? dayjs(data.expiredDate) : null;

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker format="DD-MM-YYYY" sx={{ width: '280px' }}
            label="Adicione a data de vencimento"
            value={initialDate}
            onChange={(event) => handleDateChange(event, data)} />
        </DemoContainer>
      </LocalizationProvider>
    )
    //return getDateNowFrontFormated(parseInt(data.expiredDate.slice(6, -2), 10), 'dateAtDay')
  }
  const filenameTemplate = (data) => {
    if (!data.localFile) {
        return "Nenhum arquivo anexado";
    }

    const blob = base64ToBlob(data.localFile, data.mediaType);
    return (
        <a href={blob} style={{ color: '#4b5563', fontStyle: 'italic' }}
            target="_blank" rel="noopener noreferrer">
            {data.fileName || 'Visualizar Anexo'}
        </a>
    );
  }

  const attachFileTemplate = (rowData) => {
    // rowData contém os dados da linha atual (id, manufacturerName, fileName, etc.)
    return (
        <Button
            component="label" // Permite que o botão atue como um label para o input
            role={undefined} // Remove o role implícito se não for aplicável
            variant="contained"
            tabIndex={-1} // Garante que o foco vá para o input
            startIcon={<CloudUploadIcon />}
        >
            Anexar
            <VisuallyHiddenInput
                type="file"
                accept="application/pdf" // Aceita apenas arquivos PDF
                onChange={(event) => { addFile(event.target.files, rowData.id); event.target.value = ""; }} // <--- AQUI CHAMAMOS O addFile com o ID da linha!
            />
        </Button>
    );
  };

  return (
    <React.Fragment>
      <Grid container >
        <Grid item size={6} sx={{ textAlign: 'left' }} container>
          <Alert severity="info">
            Anexe a Carta de Exclusividade (apenas PDF)
          </Alert>
        </Grid>
      </Grid>
      <PrimeReactProvider>
        <div className="card" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <DataTable size='small' emptyMessage="Adicionar Carta de Exclusividade" value={user.infoS4H.exclusivityLetter.filter(activeLetters)}
            tableStyle={{ minWidth: '50rem' }} >
            <Column body={attachFileTemplate} header="Ações"></Column>
            <Column field="fileName" header="Arquivo" body={filenameTemplate}></Column>     
            <Column field="manufacturerName" header="Fabricante"></Column>       
            <Column field="expiredDate" header="Data Vencimento" body={expiredDateTemplate}></Column>
          </DataTable>
        </div>
      </PrimeReactProvider>
      <CustomDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        message={dialogMessage}
        color={dialogColor}
        icon={dialogIcon}
      />
    </React.Fragment>
  );
}