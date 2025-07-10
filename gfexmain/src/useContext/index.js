import React, { createContext, useState, useContext, useCallback } from 'react';
import { _assembleOrFilterGeneric } from '../utils';
import { getCountIndicator, getTableData } from '../api';
export const DashboardContext = createContext();


export const DashboardContextProvider = (props) => {
  const [supplier, setSupplier] = useState({ validatedPetro: null });
  const [selectedMaterials, setSelectedMaterials] = useState(null);
  const [selectedMaterialsMastDet, setSelectedMaterialsMastDet] = useState({
    matnr: null, fields: [],
    InformacoesTecnicas: ''
  });
  const [loadingPage, setLoadingPage] = useState(false);
  const [cacheFieldValues, setCacheFieldValues] = useState([]);
  const [materials, setMaterials] = useState(null);
  const [countIndicators, setCountIndicators] = useState({
    ataPreco: {
      filled: 0,
      notFilled: 0,
      total: 0
    },
    minutaContratual: {
      agree: 0,
      notAgree: 0,
      notIdentify: 0,
      total: 0
    },
    informacoesTecnicas: {
      approved: 0,
      notIdentify: 0,
      awaitApproval: 0,
      total: 0
    },
    comercializacao: {
      recog: 0,
      notRecog: 0,
      notIdentify: 0,
      total: 0
    }
  });

  const setFieldValueMatSelect = (oEntry) => {
    setSelectedMaterialsMastDet(prevState => ({
      ...prevState,
      fields: prevState.fields.map((item) => {
        if (item.Carac === oEntry.Carac && item.PosCarac === oEntry.PosCarac) {
          return oEntry
        }
        return item
      })
    }));
  }
  const setAFieldsValueMatSelect = (oEntry) => {
    setSelectedMaterialsMastDet(prevState => ({
      ...prevState,
      fields:oEntry
    }));
  }
  const setSupplierContext = (oSupplier) => {
    const permission = oSupplier !== undefined ? oSupplier.validatedPetro : 'nao_cadastrado'
    setSupplier({ ...oSupplier, validatedPetro: permission });
  }
  const setSelectedMaterialsContext = (aValues) => {
    setSelectedMaterials(aValues);
  }


  const loadData = useCallback(async () => {
    setMaterials([]);

    try {
      setLoadingPage(true);
      if (Object.keys(supplier).length > 1) {
        const sFiltersClasses = _assembleOrFilterGeneric(supplier, 'classDesc', 'class', 'class');
        const sFiltersManufactureres = _assembleOrFilterGeneric(supplier, 'mfrnr', 'manufacturer', 'text');
        const sFilter = `fornecedorInex eq '10097577'and (${sFiltersClasses}) and (${sFiltersManufactureres})`
        const countRecog = await getCountIndicator({
          $filter: `${sFilter} and NmReconhecido eq 'Comercializo'`
        });
        const countNotRecog = await getCountIndicator({
          $filter: `${sFilter} and NmReconhecido eq 'Não Comercializo'`
        });
        const countNotIdentify = await getCountIndicator({
          $filter: `${sFilter} and (NmReconhecido ne 'Não Comercializo' and NmReconhecido ne 'Comercializo')`
        });

        const countPriceAta = await getCountIndicator({
          $filter: `${sFilter} and AtaPrecoPreenchida eq 'Preenchido' and NmReconhecido eq 'Comercializo'`
        });

        const countPriceAtaNeedToFill = await getCountIndicator({
          $filter: `${sFilter} and AtaPrecoPreenchida eq 'Preencher' and NmReconhecido eq 'Comercializo'`
        });
        const countTecInfo = await getCountIndicator({
          $filter: `${sFilter} and InformacoesTecnicas eq 'Validada'`
        });
        const countTecInfoNeedToFill = await getCountIndicator({
          $filter: `${sFilter} and InformacoesTecnicas eq 'Validar'`
        });
        setCountIndicators({
          ataPreco: {
            filled: countPriceAta,
            notFilled: countPriceAtaNeedToFill,
            total: countPriceAta + countPriceAtaNeedToFill
          },
          minutaContratual: {
            agree: 0,
            notAgree: 0,
            notIdentify: 0,
            total: 1 
          },
          informacoesTecnicas: {
            approved: countTecInfo,
            awaitApproval: 0,
            notIdentify: countTecInfoNeedToFill,
            total: countTecInfo + 0 + countTecInfoNeedToFill
          },
          comercializacao: {
            recog: countRecog,
            notRecog: countNotRecog,
            total: countRecog + countNotRecog + countNotIdentify,
            notIdentify: countNotIdentify,
          }
        });

        const _items = await getTableData({
          $top: 200000,
          $filter: sFilter
        });
        const itemsWithIds = _items.map((item, index) => {
          item.id = index;
          return item;
        });
        setMaterials(itemsWithIds);
        updateSelectedMaterials(itemsWithIds);
      }
    } finally {
      setLoadingPage(false);
    }
  })

  const updateSelectedMaterials = (aEntry) => {
    const aSelectedMaterials = selectedMaterials
      ?.map((item) => (aEntry.filter((itemfilter) => (itemfilter.matnr === item.matnr))[0]));
    if (aSelectedMaterials !== undefined)
      setSelectedMaterials(aSelectedMaterials)
  }


  return <DashboardContext.Provider value={{
    supplier, loadingPage, countIndicators, materials, setSupplierContext, setLoadingPage,
    selectedMaterials, setSelectedMaterialsContext, selectedMaterialsMastDet,
    setSelectedMaterialsMastDet, cacheFieldValues, setCacheFieldValues, setFieldValueMatSelect,
    loadData, setAFieldsValueMatSelect
  }}>
    {props.children}
  </DashboardContext.Provider>
}

export const useDashboard = () => useContext(DashboardContext);
