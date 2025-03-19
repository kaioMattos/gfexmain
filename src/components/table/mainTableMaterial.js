import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { getTableData, getTableCount, getUserHana } from "api";
import { BsClipboardCheck } from "react-icons/bs";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdDoNotDisturb } from "react-icons/md";
import { PiSealQuestionLight } from "react-icons/pi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { PiSealWarningLight } from "react-icons/pi";
import { TbFileInfo } from "react-icons/tb";
import { BsClipboard2Check } from "react-icons/bs";
import { BsClipboard2Minus } from "react-icons/bs";
import { AppBar, Box, Toolbar, Typography, CardHeader } from '@mui/material';
export default function MainTableMaterial() {
  const [materials, setMaterials] = useState(null);
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowCount, setRowCount] = useState(0);

  const [statuses] = useState(['SIM', 'NÃO', '']);
  
  const getSeverityTec = (status) => {
    switch (status) {
      case 'SIM':
        return 'success';
      default:
        return 'info';
    }
  };

  const getSeverity = (status) => {
    switch (status) {
      case 'NÃO':
        return 'danger';

      case 'SIM':
        return 'success';

      case '':
        return 'info';
    }
  };
  const getValueInfoTec = (status) => {
    switch (status) {
      case 'NÃO':
      case '':
        return 'Incompleta';
      case 'SIM':
        return 'Preenchida';
    }
  };
  const getValueRecog = (status) => {
    switch (status) {
      case 'NÃO':
        return 'Não comercializo';
      case '':
        return 'Falta Identificação';
      case 'SIM':
        return 'Comercializo';
    }
  };

  const getICon = (status) => {
    switch (status) {
      case 'NÃO':
        return <MdDoNotDisturb size={20}  />;

      case 'SIM':
        return <IoMdCheckmarkCircleOutline size={20}  />;

      case '':
        return <IoMdInformationCircleOutline size={20}  />;
    }
  };
  const getTextTemplateInfoTec = (status) => {
    switch (status) {
      case 'NÃO':
      case '':
        return  <Typography variant='subtitle1' sx={{ color: 'rgb(99, 99, 99)' }}>
          Incompleta
        <BsClipboard2Check size={20} />
      </Typography>;

      case 'SIM':
        return <Typography variant='subtitle1' sx={{ color: 'green' }}>
          Preenchida
        <BsClipboard2Check size={20} />
      </Typography>; 
    }
  };
  const getIConTec = (status) => {
    switch (status) {
      case 'NÃO':
      case '':
        return <BsClipboard2Minus size={20} />;

      case 'SIM':
        return <BsClipboard2Check size={20} />;
    }
  };

  const _assembleFilterGeneric = (propFilter, value) => (` ${propFilter} eq '${value}'`);
  const _assembleOrFilterGeneric = (objHana, propOfilter, propObjHana) => {
    const aValues = JSON.parse(objHana[propObjHana]);
    const aFiltersValues = aValues.filter((item) => (item.status))
      .map((item) => (`${_assembleFilterGeneric(propOfilter, item[propObjHana])} or`));
    console.log(aFiltersValues)
    return aFiltersValues.join('').slice(0, -3);
  };
  const PAGE_SIZE = 15;

  const loadData = async (isFirstLoad, skip = 0) => {
    try {
      setMaterials([]);
      setLoading(true);
      // const usersS4 = await getUserHana({ $filter: `documentId eq '03680252000105'` });
      // const sFiltersClasses = _assembleOrFilterGeneric(usersS4, 'classDesc', 'class');
      // const sFiltersManufactureres = _assembleOrFilterGeneric(usersS4, 'mfrnr', 'manufacturer');
      // const sFilter = ` fornecedorInex eq '10097577'and (${sFiltersClasses}) and (${sFiltersManufactureres})`
       const sFilter = ` fornecedorInex eq '10097577'`
      if (isFirstLoad) {
        const count = await getTableCount({ $filter: sFilter });
        setRowCount(count);
      }

      const _items = await getTableData({
        $top: PAGE_SIZE,
        $skip: skip,
        $filter: sFilter
      });
      const itemsWithIds = _items.map((item, index) => {
        item.id = index;
        return item;
      });
      setMaterials(itemsWithIds);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData(true);
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
      classDesc: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      mfrnr: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    });

    setGlobalFilterValue('');
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button type="button" icon="pi pi-filter-slash" label="Limpar Filtros" outlined onClick={clearFilter} />
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Pesquisar" />
        </IconField>
      </div>
    );
  };
  const reconhecidoBodyTemplate = (rowData, prop) => {
    return <Tag style={{width:'150px'}} value={getValueRecog(rowData[prop])} icon={getICon(rowData[prop])} severity={getSeverity(rowData[prop])} />;
  };
  const infoTecBodyTemplate = (rowData) => {
    return getTextTemplateInfoTec(rowData);
    // return <Tag style={{width:'150px'}} value={getValueInfoTec(rowData)} icon={getIConTec(rowData)} severity={getSeverityTec(rowData)} />;
  };
  const header = renderHeader();

  return (
    <div className="card">
      <DataTable value={materials} paginator showGridlines rows={10} loading={loading} dataKey="id"
        filters={filters} globalFilterFields={['matnr', 'maktx', 'classDesc', 'mfrnr']} header={header}
        emptyMessage="Materiais não encontrados" onFilter={(e) => setFilters(e.filters)}>
        <Column field="matnr" header="Material" filter filterPlaceholder="Pesquisar por N° Mat" style={{ minWidth: '12rem' }} />
        <Column field="maktx" header="Descrição" filter filterPlaceholder="Pesquisar por Descrição" style={{ minWidth: '12rem' }} />
        <Column field="classDesc" header="Classe" filter filterPlaceholder="Pesquisar por Classe" style={{ minWidth: '12rem' }} />
        <Column field="mfrnr" header="Fabricante" filter filterPlaceholder="Pesquisar por Fabricante" style={{ minWidth: '12rem' }} />
        <Column field="NmReconhecido" header="Reconhecido"  body={(e)=>reconhecidoBodyTemplate(e, 'NmReconhecido')} filter filterPlaceholder="Pesquisar por Reconhecidos" style={{ minWidth: '12rem' }} />
        <Column field="InformacoesTecnicas" header="Informações Técnicas" body={(e)=>infoTecBodyTemplate(e.InformacoesTecnicas)} filter filterPlaceholder="Pesquisar por Reconhecidos" style={{ minWidth: '12rem' }} />
      </DataTable>
    </div>
  )
}