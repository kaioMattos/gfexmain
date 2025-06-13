import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { getTableData, getTableCount, getUserHana, postRecogMaterial } from "api";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdDoNotDisturb } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { BsClipboard2Check } from "react-icons/bs";
import { BsClipboard2Minus } from "react-icons/bs";
import { Box, Typography, Collapse, Grid } from '@mui/material';
import { LuFilePen } from "react-icons/lu";
import { AiOutlineFileSearch } from "react-icons/ai";
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import Highlight from 'components/Highlight';
import { useDashboard } from 'useContext';
import "./styles.css";

export default function TableInfo({ materials, loading, loadData, HeaderTable, sActionHeader }) {
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const { selectedMaterials, setSelectedMaterialsContext } = useDashboard();
  const [statuses] = useState(['Comercializo', 'Não Comercializo', 'Falta Identificação']);
  const [statusAtaPrice] = useState(['Preenchido', 'Não Aplicável', 'Preencher', 'Aguardando Identificação']);
  const [statusInfoTec] = useState(['Validado', 'Não Aplicável', 'Validar', 'Aguardando Identificação']);
  const [selectedAction, setSelectedAction] = useState(null);
  const massActions = ['Comercializo', 'Não Comercializo'];
  const [openDialogRecog, setoOpenDialogRecog] = useState(false);
  const [actionMass, setActionMass] = useState(true);


  const getDateNow = () => {
    const oDate = new Date();
    const year = oDate.getFullYear();
    const month = oDate.getMonth() <= 9 ? `0${oDate.getMonth()}` : oDate.getMonth();
    const day = oDate.getDate() <= 9 ? `0${oDate.getDate()}` : oDate.getDate();
    const hours = oDate.getHours() <= 9 ? `0${oDate.getHours()}` : oDate.getHours();
    const minutes = oDate.getMinutes() <= 9 ? `0${oDate.getMinutes()}` : oDate.getMinutes();
    const seconds = oDate.getSeconds() <= 9 ? `0${oDate.getSeconds()}` : oDate.getSeconds();
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
  }
  const recogMaterial = async () => {
    let aPromises = [];
    const recog = selectedAction === 'Comercializo' ? 'CMR' : 'NCM';
    const priceAta = selectedAction === 'Comercializo' ? 'FPR' : 'NAP';
    const tecInfo = selectedAction === 'Comercializo' ? 'FVL' : 'NAP';
    const aEntry = selectedMaterials.map((material) => ({
      "Nm": material.matnr,
      "DataCriacao": getDateNow(),
      "UsuarioCriador": "EMERSON",
      "NmReconhecido": recog,
      "AtaPrecoPreenchida": priceAta,
      "InformacoesTecnicas": tecInfo,
      "to_Val2Rec": {
        "Nm": material.matnr,
        "ValorUnitarioBruto": null,
        "PrazoEntrega": null,
        "PrazoValidadeProposta": null,
        "Descricao": null
      }
    }));

    aPromises = aEntry.map((oEntry) => (postRecogMaterial(oEntry)));
    const resolvedPromises = await Promise.all(aPromises);
    loadData(false);
  }
  const handleClickOpen = () => {
    setoOpenDialogRecog(true);
  };
  const handleClose = () => {
    setoOpenDialogRecog(false);
  };


  const getSeverityTec = (status) => {
    switch (status) {
      case 'true':
        return 'success';
      default:
        return 'info';
    }
  };

  const getSeverity = (status) => {
    switch (status) {
      case 'Não Comercializo':
      case 'Não Aplicável':
        return 'danger';

      case 'Comercializo':
      case 'Preenchido':
      case 'Validado':
        return 'success';

      default:
        return 'info';
    }
  };
  const getValueInfoTec = (status) => {
    switch (status) {
      case 'false':
        return 'Incompleta';
      case 'true':
        return 'Preenchida';
      default:
        return ''
    }
  };
  const getValueRecog = (status) => {
    switch (status) {
      case 'NÃO':
        return 'Não comercializo';
      case 'SIM':
        return 'Comercializo';
      default:
        return 'Falta Identificação';
    }
  };

  const getICon = (status) => {
    switch (status) {
      case 'Não Comercializo':
      case 'Não Aplicável':
        return <MdDoNotDisturb size={20} />;
      case 'Comercializo':
      case 'Preenchido':
      case 'Validado':
        return <IoMdCheckmarkCircleOutline size={20} />;
      default:
        return <IoMdInformationCircleOutline size={20} />;
    }
  };


  const getTextTemplateInfoTec = (status) => {
    switch (status) {
      case 'Não Aplicável':
        return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='subtitle1' sx={{ color: 'red' }}>
            {status}
          </Typography>
          {/* <Button icon={<RiFileCloseLine size={20} />} rounded text aria-label="Filter" severity="danger"  /> */}
          {/* <Button icon={<AiOutlineFileSearch   size={20} />} rounded outlined severity="success" aria-label="Search" /> */}

        </Box>

      case 'Validada':
        return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='subtitle1' sx={{ color: 'green' }}>
            {status}
          </Typography>
          <Button icon={<AiOutlineFileSearch size={20} />} rounded text severity="success" aria-label="Search" />
        </Box>
      case 'Validar':
        return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='subtitle1' sx={{ color: 'rgb(14, 165, 233)' }}>
            {status}
          </Typography>
          <Button icon={<LuFilePen size={20} />} rounded text severity="info" aria-label="Search" />
        </Box>
      default:
        return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='subtitle1' sx={{ color: 'rgb(99, 99, 99)' }}>
            {status}
          </Typography>
          {/* <Button icon={<HiOutlineDocumentMagnifyingGlass size={20} />} rounded text aria-label="Filter" /> */}
          {/* <Button icon={<AiOutlineFileSearch   size={20} />} rounded outlined severity="success" aria-label="Search" /> */}

        </Box>
    }
  };
  const getIConTec = (status) => {
    switch (status) {
      case 'false':
        return <BsClipboard2Minus size={20} />;

      case 'true':
        return <BsClipboard2Check size={20} />;
      default:
        return null
    }
  };

  const _assembleFilterGeneric = (propFilter, value) => (` ${propFilter} eq '${value}'`);
  const _assembleOrFilterGeneric = (objHana, propOfilter, propObjHana) => {
    const aValues = JSON.parse(objHana[propObjHana]);
    const aFiltersValues = aValues.filter((item) => (item.status))
      .map((item) => (`${_assembleFilterGeneric(propOfilter, item[propObjHana])} or`));
    // console.log(aFiltersValues)
    return aFiltersValues.join('').slice(0, -3);
  };
  const PAGE_SIZE = 200000;


  useEffect(() => {
    // loadData(true);
    initFilters();
  }, []);


  const clearFilter = () => {
    initFilters();
  };
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      matnr: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      maktx: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      mfrpn: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      classDesc: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      mfrnr: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      NmReconhecido: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      AtaPrecoPreenchida: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      InformacoesTecnicas: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    });

    setGlobalFilterValue('');
  };
  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(materials);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      saveAsExcelFile(excelBuffer, 'materials');
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
          type: EXCEL_TYPE
        });

        module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
    });
  };
  const renderHeader = () => {
    return (

      <Grid container spacing={3}>
        <Grid size={6} item >
          <Grid container sx={{ justifyContent: 'flex-start' }} >
            <Button type="button" icon="pi pi-filter-slash" label="Limpar Filtros" outlined onClick={clearFilter} />
          </Grid>
        </Grid>
        <Grid size={6} item >
          <Grid container sx={{ justifyContent: 'flex-end' }} >
            <Grid>
              <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Pesquisar" />
              </IconField>
            </Grid>
            <Grid>
              <Button type="button" icon="pi pi-file-excel" style={{ marginLeft: '10px' }} label="Exportar" severity="success" onClick={exportExcel} data-pr-tooltip="XLS" />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={12} item >
          <Grid container sx={{ justifyContent: 'flex-start', alignItems: 'center' }} >
            <Grid>
              <Typography>Selecionar Materiais para <Highlight className="destTextHeaderTable">{sActionHeader}</Highlight></Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12} item >
          {/* <Collapse in={selectedMaterials !== null && selectedMaterials.length > 1 ? true : false}> */}

          <Grid container sx={{ justifyContent: 'flex-start', alignItems: 'center' }} >
            <Grid>
              <Typography>
                Materiais selecionados: <Highlight>{selectedMaterials !== null && selectedMaterials.length > 0 ? selectedMaterials.length : 0}</Highlight>
              </Typography>
            </Grid>
            {HeaderTable}
          </Grid>
          {/* <Grid container sx={{ justifyContent: 'flex-start', alignItems: 'center' }} >
              <Grid>
                <Typography>Identificação em massa:</Typography>
              </Grid>
              <Grid>
                <Dropdown value={selectedAction} style={{ marginLeft: '10px' }} onChange={(e) => setSelectedAction(e.value)} options={massActions} optionLabel="name"
                  placeholder="Selecione a ação" className="w-full md:w-16rem" />
              </Grid>
              <Grid>
                <Button disabled={selectedAction !== null ? false : true} style={{ marginLeft: '10px' }} onClick={() => recogMaterial()} icon={<TfiSave size={20} />} outlined severity="success" aria-label="Search" />
              </Grid>
            </Grid> */}
          {/* </Collapse> */}
        </Grid>

      </Grid>

    );
  };
  const recogFilterTemplate = (options) => {
    return <Dropdown value={options.value} options={statuses}
      onChange={(e) => options.filterCallback(e.value, options.index)}
      itemTemplate={recogItemTemplate} placeholder="Select One"
      className="p-column-filter" showClear
    />;
  };
  const recogItemTemplate = (option) => {
    return <Tag style={{ width: '150px', cursor: 'pointer', }} value={option} icon={getICon(option)} severity={getSeverity(option)} >
    </Tag>
  };
  const recogBodyTemplate = (rowData, prop) => {
    return <Tag onClick={() => { setoOpenDialogRecog(true) }} style={{ width: '150px', cursor: 'pointer', }} value={rowData[prop]} icon={getICon(rowData[prop])} severity={getSeverity(rowData[prop])} >
    </Tag>
  };
  const ataPricFilterTemplate = (options) => {
    return <Dropdown value={options.value} options={statusAtaPrice}
      onChange={(e) => options.filterCallback(e.value, options.index)}
      itemTemplate={ataPricItemTemplate} placeholder="Select One"
      className="p-column-filter" showClear
    />;
  };
  const ataPricItemTemplate = (status) => {
    switch (status) {
      case 'Não Aplicável':
      case 'Preenchido':
      case 'Preencher':
        return <Tag
          style={{ width: '150px', cursor: 'pointer', }} value={status}
          icon={getICon(status)} severity={getSeverity(status)} >
        </Tag>
      case 'Aguardando Identificação':
        return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='subtitle1' sx={{ color: 'rgb(99, 99, 99)' }}>
            {status}
          </Typography>
        </Box>
    }

  };
  const infoTecFilterTemplate = (options) => {
    return <Dropdown value={options.value} options={statusInfoTec}
      onChange={(e) => options.filterCallback(e.value, options.index)}
      itemTemplate={infoTecItemTemplate} placeholder="Select One"
      className="p-column-filter" showClear
    />;
  };
  const infoTecItemTemplate = (status) => {
    switch (status) {
      case 'Não Aplicável':
      case 'Validado':
      case 'Validar':
        return <Tag
          style={{ width: '150px', cursor: 'pointer', }} value={status}
          icon={getICon(status)} severity={getSeverity(status)} >
        </Tag>
      case 'Aguardando Identificação':
        return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='subtitle1' sx={{ color: 'rgb(99, 99, 99)' }}>
            {status}
          </Typography>
        </Box>
    }

  };
  const infoTecBodyTemplate = (status, prop) => {
    switch (status) {
      case 'Não Aplicável':
      case 'Validar':
      case 'Validado':
        return <Tag onClick={() => { setoOpenDialogRecog(true) }}
          style={{ width: '150px', cursor: 'pointer', }} value={status}
          icon={getICon(status)} severity={getSeverity(status)} >
        </Tag>
      default:
        return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='subtitle1' sx={{ color: 'rgb(99, 99, 99)' }}>
            {status}
          </Typography>
        </Box>
    }
  };
  const ataPricBodyTemplate = (status, prop) => {
    switch (status) {
      case 'Não Aplicável':
      case 'Preenchido':
      case 'Preencher':
        return <Tag onClick={() => { setoOpenDialogRecog(true) }}
          style={{ width: '150px', cursor: 'pointer', }} value={status}
          icon={getICon(status)} severity={getSeverity(status)} >
        </Tag>
      default:
        return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='subtitle1' sx={{ color: 'rgb(99, 99, 99)' }}>
            {status}
          </Typography>
        </Box>
    }

  };
  const infoTecBodyTemplate_ = (rowData) => {
    return getTextTemplateInfoTec(rowData);
    // return <Tag style={{width:'150px'}} value={getValueInfoTec(rowData)} icon={getIConTec(rowData)} severity={getSeverityTec(rowData)} />;
  };
  const ataPriceFilterTemplate = (options) => {
    return <Dropdown value={options.value} options={statuses}
      onChange={(e) => options.filterCallback(e.value, options.index)}
      itemTemplate={<Typography>option</Typography>} placeholder="Select One"
      className="p-column-filter" showClear
    />;
  };


  const infoTecFilterTemplate_ = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
          Preenchida
        </label>
        <TriStateCheckbox inputId="verified-filter" value={options.value} onChange={(e) => options.filterCallback(e.value)} />
      </div>
    );
  };
  const header = renderHeader();

  return (
    <Box style={{ padding: '5% 0 0 0', }}>
      <Typography variant="h5" component="h6" sx={{ textAlign: 'left', paddingBottom: '1%', color: '#4d4d4d' }}>
        Lista de Materiais
      </Typography>
      <div className="card">
        <DataTable className='font-face-ptRg' size='small' value={materials} paginator rows={10} loading={loading} dataKey="id"
          filters={filters} globalFilterFields={['matnr', 'maktx', 'classDesc', 'mfrnr', 'mfrpn']} header={header}
          emptyMessage="Materiais não encontrados" onFilter={(e) => setFilters(e.filters)}
          onSelectionChange={async (e) => await setSelectedMaterialsContext(e.value)} selection={selectedMaterials}
          scrollable selectionMode='checkbox' >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field="matnr" header="Material" filter filterPlaceholder="Pesquisar por N° Mat" style={{ minWidth: '8rem' }} />
          <Column field="maktx" header="Descrição" filter filterPlaceholder="Pesquisar por Descrição" style={{ minWidth: '10rem' }} />
          <Column field="classDesc" header="Classe" filter filterPlaceholder="Pesquisar por Classe" style={{ minWidth: '15rem' }} />
          <Column field="mfrpn" header="N° peça fabricante" filter filterPlaceholder="Pesquisar por peça fabricante" style={{ minWidth: '10rem' }} />
          <Column field="mfrnr" header="Fabricante" filter filterPlaceholder="Pesquisar por Fabricante" style={{ minWidth: '8rem' }} />
          {sActionHeader.includes('Identificar') && (
            <Column field="NmReconhecido" header="Comercializado" filterMenuStyle={{ width: '10rem' }} body={(e) => recogBodyTemplate(e, 'NmReconhecido')} filter filterElement={recogFilterTemplate} style={{ minWidth: '12rem' }} />
          )}
          {sActionHeader.includes('Identificar') && (
            <Column field="AtaPrecoPreenchida" header="Ata de Preço" filterMenuStyle={{ width: '10rem' }} body={(e) => ataPricBodyTemplate(e.AtaPrecoPreenchida)} filter filterElement={ataPricFilterTemplate} style={{ minWidth: '12rem' }} />
          )}


        </DataTable>
      </div>
    </Box>
  )
}