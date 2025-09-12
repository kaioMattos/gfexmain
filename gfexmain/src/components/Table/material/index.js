import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper,
  Chip, Box,
  IconButton,
  MenuItem as MenuItemComponent,
  TablePagination,
} from "@mui/material"
import {
  Menu as MenuIcon, FirstPage, LastPage,
  KeyboardArrowLeft, KeyboardArrowRight
} from "@mui/icons-material";

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="primeira página">
        <FirstPage />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="página anterior">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="próxima página"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="última página"
      >
        <LastPage />
      </IconButton>
    </Box>
  )
}

export default function TableMaterial({
  materials,
  isMultSelect,
  funcPage,
  selectedMaterials, setSelectedMaterials,
  totalCount, setTotalCount,
  rowsPerPage, setRowsPerPage,
  page, setPage
}) {

  const isSelected = (id) => selectedMaterials.includes(id);

  const handleClick = (event, id) => {
    if (isMultSelect) {
      const selectedIndex = selectedMaterials.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedMaterials, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selectedMaterials.slice(1));
      } else if (selectedIndex === selectedMaterials.length - 1) {
        newSelected = newSelected.concat(selectedMaterials.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selectedMaterials.slice(0, selectedIndex),
          selectedMaterials.slice(selectedIndex + 1)
        );
      }

      setSelectedMaterials(newSelected);
    } else {
      if (selectedMaterials.includes(id)) {
        setSelectedMaterials([]);
      } else {
        setSelectedMaterials([id]);
      }
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = materials.map((n) => n.id);
      setSelectedMaterials(newSelecteds);
      return;
    }
    setSelectedMaterials([]);
  };



  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <>
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0" }}>
        <Table>
          <TableHead>
            <TableRow>
              {isMultSelect && <TableCell padding="checkbox">
                <input
                  type="checkbox"
                  checked={selectedMaterials.length > 0 && selectedMaterials.length === materials.length}
                  onChange={handleSelectAllClick}
                  indeterminate={
                    selectedMaterials.length > 0 &&
                    selectedMaterials.length < materials.length
                  }
                />
              </TableCell>}
              <TableCell>Material</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Classe</TableCell>
              <TableCell>N° peça fabricante</TableCell>
              <TableCell>Fabricante</TableCell>
              <TableCell>Comercializado</TableCell>
              {funcPage === 'Home' && <TableCell>Info. Técnicas</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {materials.map((material) => {
              const isItemSelected = isSelected(material.id);
              return (
                <>
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, material.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={material.id}
                    selected={isItemSelected}
                  >
                    {isMultSelect && <TableCell padding="checkbox">
                      <input
                        type="checkbox"
                        checked={isItemSelected}
                        onChange={(event) => handleClick(event, material.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>}

                    <TableCell sx={{ fontWeight: 500 }}>{material.matnr}</TableCell>
                    <TableCell>{material.maktx}</TableCell>
                    <TableCell>{material.classDesc}</TableCell>
                    <TableCell>{material.mfrpn}</TableCell>
                    <TableCell>{material.mfrnr}</TableCell>
                    <TableCell>
                      <Chip
                        sx={{
                          width: '172px',
                          bgcolor:
                            material.NmReconhecido === 'Comercializo' ? "success.light" :
                              material.NmReconhecido === 'Não Comercializo' ? "error.light" : "warning.light",
                          color: "white",
                          borderColor:
                            material.NmReconhecido === 'Comercializo' ? "success.main" :
                              material.NmReconhecido === 'Não Comercializo' ? "error.main" : "warning.main"
                        }}
                        label={material.NmReconhecido !== 'Comercializo' &&
                          material.NmReconhecido !== 'Não Comercializo' ?
                          'Pendente Avaliação' : material.NmReconhecido}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    {funcPage === 'Home' && <TableCell>
                      <Chip
                        sx={{
                          width: '172px',
                          bgcolor:
                            material.InformacoesTecnicas === 'Validada' ? "success.light" :
                              material.InformacoesTecnicas === 'Não Aplicável' ? "greyInfo.light" :
                                material.InformacoesTecnicas === 'Validar' ? "warning.light" :
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
                            material.InformacoesTecnicas === 'Aguardando Avaliação Petrobrás' ? 'Em Análise(Petro)' :
                              material.InformacoesTecnicas} size="small" variant="outlined" />
                    </TableCell>}
                  </TableRow>
                </>
              )
            })}
          </TableBody>

        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
        labelRowsPerPage="Itens por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count.toLocaleString() : `mais de ${to.toLocaleString()}`}`
        }
        sx={{
          borderTop: "1px solid #e2e8f0",
          "& .MuiTablePagination-toolbar": {
            paddingLeft: 2,
            paddingRight: 2,
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            fontSize: "0.875rem",
            color: "text.secondary",
          },
        }}
      />
    </>
  )
}
