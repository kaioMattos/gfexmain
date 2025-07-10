import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton
} from '@mui/material';
import { MdDelete } from "react-icons/md";
import { useDashboard } from '../../useContext';

export default function SelectFile({ open, onClose, data }) {
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { selectedMaterialsMastDet, setFieldValueMatSelect, loadingPage } = useDashboard();


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFiles([...files, { id: files.length + 1, name: selectedFile.name }]);
      event.target.value = null; // Limpar o input após o upload
    }
  };
  const deleteFile = (row) => {
    const newFiles = files.filter((item)=>(item.id !== row.id));
    setFiles(newFiles);
    const oValue = selectedMaterialsMastDet.fields
    .filter((item) => item.PosCarac === data.PosCarac)[0];
    oValue['fileName'] = '';
    setFieldValueMatSelect(oValue);
  }
  const handleSelectFile = (id) => {
    setSelectedFileId(id === selectedFileId ? null : id); // Alternar seleção
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSave = () => {
    // Aqui você pode implementar a lógica para salvar o arquivo selecionado
    console.log('Arquivo salvo:', files.find(file => file.id === selectedFileId));
    console.log(data);
    console.log(selectedMaterialsMastDet);
    const oValue = selectedMaterialsMastDet.fields
    .filter((item) => item.PosCarac === data.PosCarac)[0]
    oValue['fileName'] = files.find(file => file.id === selectedFileId).name
  setFieldValueMatSelect(oValue);
    onClose();
  };

  return (
    <React.Fragment>
      <Dialog maxWidth="sm" fullWidth="true" open={open} onClose={onClose}>
        <DialogTitle>Evidências Técnicas</DialogTitle>
        
        <DialogContent>
        <input
            type="file"
            id="file-upload"
            accept=".txt,.pdf,.doc,.docx" // Altere para os tipos de arquivo permitidos
            onChange={handleFileChange}
            style={{ display: 'none' }} // Oculta o input
          />
          <label htmlFor="file-upload">
            <Button variant="contained" component="span" sx={{ marginBottom: 2 }}>
              Procurar Arquivo
            </Button>
          </label>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Selecionar</TableCell>
                  <TableCell>Arquivo</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((file) => (
                  <TableRow key={file.id} onClick={() => handleSelectFile(file.id)} selected={selectedFileId === file.id}>
                    <TableCell>
                      <input
                        type="radio"
                        checked={selectedFileId === file.id}
                        readOnly
                      />
                    </TableCell>
                    <TableCell>{file.name}</TableCell>
                    <TableCell><IconButton onClick={() => { deleteFile(file) }} color="error">
                      <MdDelete />
                     </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              count={files.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} disabled={selectedFileId === null}>Salvar</Button>
          <Button onClick={onClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
   </React.Fragment>
  );
};

