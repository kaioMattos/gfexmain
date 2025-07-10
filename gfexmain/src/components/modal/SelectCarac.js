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
  Checkbox,
  Chip,
} from '@mui/material';
import { useDashboard } from '../../useContext';

const characteristicsList = [
  { id: 1, name: 'Characteristic 1' },
  { id: 2, name: 'Characteristic 2' },
  { id: 3, name: 'Characteristic 3' },
  { id: 4, name: 'Characteristic 4' },
  { id: 5, name: 'Characteristic 5' },
  // Adicione mais características conforme necessário
];

export default function SelectCarac({ open, onClose, data }) {
  const [selectedCharacteristicIds, setSelectedCharacteristicIds] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { selectedMaterialsMastDet, setFieldValueMatSelect, loadingPage } = useDashboard();

  const handleSelectCharacteristic = (PosCarac) => {
    setSelectedCharacteristicIds((prev) =>
      prev.includes(PosCarac) ? prev.filter((charId) => charId !== PosCarac) : [...prev, PosCarac]
    ); // Alternar seleção
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const duplicateFileToCharac = (array)=>{
    array.map((item)=>(setFieldValueMatSelect({...item, fileName:data.fileName})));
  }
  const handleSave = () => {
    const characSelectedContext = selectedMaterialsMastDet.fields
    .filter(characteristic => selectedCharacteristicIds.includes(characteristic.PosCarac))
    duplicateFileToCharac(characSelectedContext);
    onClose();
  };

  return (
    <React.Fragment>
      <Dialog maxWidth="sm" fullWidth="true" open={open} onClose={onClose}>
        <DialogTitle>Selecionar Características</DialogTitle>
        <DialogContent>
          <Chip
            label={data.fileName}
            size="small"
            variant="outlined"
            sx={{ bgcolor: "#f9f9f9", color: "blue", borderColor: "blue", cursor: 'pointer', }}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Selecionar</TableCell>
                  <TableCell>Característica</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedMaterialsMastDet.fields.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((characteristic) => (
                  <TableRow key={characteristic.PosCarac} selected={selectedCharacteristicIds.includes(characteristic.PosCarac)}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCharacteristicIds.includes(characteristic.PosCarac)}
                        onChange={() => handleSelectCharacteristic(characteristic.PosCarac)}
                      />
                    </TableCell>
                    <TableCell>{characteristic.Carac}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              count={selectedMaterialsMastDet.fields.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} disabled={selectedCharacteristicIds.length === 0}>Salvar</Button>
          <Button onClick={onClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

