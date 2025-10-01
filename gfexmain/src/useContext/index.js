import React, { createContext, useState, useContext, useCallback } from 'react';
import { _assembleOrFilterGeneric } from '../utils';
import { getCountIndicator, getMaterial } from '../api';
import { useAuth } from './AuthContext';
export const DashboardContext = createContext();

export const DashboardContextProvider = (props) => {
  const { user, setUser } = useAuth();
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
      fields: oEntry
    }));
  }

  const setSelectedMaterialsContext = (aValues) => {
    setSelectedMaterials(aValues);
  }
  const loadData = useCallback(async () => {
    setMaterials([]);

    try {
      setLoadingPage(true);
      if (Object.keys(user).length > 1 && user.profileType === 'fornecedor' && user.isRegistered) {
        const sCnpj = _assembleOrFilterGeneric(user.infoS4H, 'fornecedorInex', 'cnpj', 'lifnr');
        const sFiltersClasses = _assembleOrFilterGeneric(user.infoS4H, 'classDesc', 'class', 'class');
        const sFiltersManufactureres = _assembleOrFilterGeneric(user.infoS4H, 'mfrnr', 'manufacturer', 'text');
        const sFilter = ` (${sCnpj}) and (${sFiltersClasses}) and (${sFiltersManufactureres})`
        const countRecog = await getCountIndicator({
          filter: `${sFilter} and NmReconhecido eq 'Comercializo'`
        });
        const countNotRecog = await getCountIndicator({
          filter: `${sFilter} and NmReconhecido eq 'Não Comercializo'`
        });
        const countNotIdentify = await getCountIndicator({
          filter: `${sFilter} and (NmReconhecido ne 'Não Comercializo' and NmReconhecido ne 'Comercializo')`
        });

        const countPriceAta = await getCountIndicator({
          filter: `${sFilter} and AtaPrecoPreenchida eq 'Preenchido' and NmReconhecido eq 'Comercializo'`
        });
        const countPriceAtaNeedToFill = await getCountIndicator({
          filter: `${sFilter} and AtaPrecoPreenchida eq 'Preencher' and NmReconhecido eq 'Comercializo'`
        });
        const countTecInfo = await getCountIndicator({
          filter: `${sFilter} and InformacoesTecnicas eq 'Validada'`
        });
        const countTecInfoNeedToFill = await getCountIndicator({
          filter: `${sFilter} and InformacoesTecnicas eq 'Validar'`
        });
        const countTecInfoAwaitPetro = await getCountIndicator({
          filter: `${sFilter} and InformacoesTecnicas eq 'Aguardando Avaliação Petrobrás'`
        });
        setCountIndicators({
          ataPreco: {
            filled: countPriceAta,
            notFilled: countPriceAtaNeedToFill,
            total: countPriceAta + countPriceAtaNeedToFill
          },
          informacoesTecnicas: {
            approved: countTecInfo,
            awaitApproval: countTecInfoAwaitPetro,
            notIdentify: countTecInfoNeedToFill,
            total: countRecog
          },
          comercializacao: {
            recog: countRecog,
            notRecog: countNotRecog,
            total: countRecog + countNotRecog + countNotIdentify,
            notIdentify: countNotIdentify,
          }
        });
        const order = { 'Comercializo': 1, 'Não Comercializo': 2, 'Falta Identificação': 3 };


       const aResultMaterials = await getMaterial({ $top: 200000, filter: sFilter });

      aResultMaterials.forEach((item, index) => {
        item.id = index;
      });

      aResultMaterials.sort((a, b) => {
        const order = { 'Comercializo': 1, 'Não Comercializo': 2, 'Falta Identificação': 3 };
        return order[a.NmReconhecido] - order[b.NmReconhecido];
      });

      setMaterials(aResultMaterials);

      updateSelectedMaterials(aResultMaterials);

      return aResultMaterials;  // **ADICIONAR ESSA LINHA**
      }
    } finally {
      setLoadingPage(false);
    }
  }, [user])

  const updateSelectedMaterials = (aEntry) => {
    const aSelectedMaterials = selectedMaterials
      ?.map((item) => (aEntry.filter((itemfilter) => (itemfilter.matnr === item.matnr))[0]));
    if (aSelectedMaterials !== undefined)
      setSelectedMaterials(aSelectedMaterials)
  }


  return <DashboardContext.Provider value={{
    user, loadingPage, countIndicators, materials, setLoadingPage,
    selectedMaterials, setSelectedMaterialsContext, selectedMaterialsMastDet,
    setSelectedMaterialsMastDet, cacheFieldValues, setCacheFieldValues, setFieldValueMatSelect,
    loadData, setAFieldsValueMatSelect, setUser
  }}>
    {props.children}
  </DashboardContext.Provider>
}

export const useDashboard = () => useContext(DashboardContext);
