import React, { useEffect, useState } from 'react';
import "./App.css";

import "./fonts/PetrobrasSans/PetrobrasSans_Rg.ttf";
import NotFound from "pages/NotFound";
import AppBar from "components/AppBar";
import MasterPage from "pages/MasterPage";
import Indicators from './routes/dashboard'
import { Card, Typography } from '@mui/material';
import Header from './components/header';
import TelaErroPermissao from './pages/NotPermission'
import { getUserHana, getCountIndicator, getTableData } from "api";
import MainTableMaterial from "./components/table/mainTableMaterial";

const _assembleFilterGeneric = (propFilter, value) => (` ${propFilter} eq '${value}'`);

const _assembleOrFilterGeneric = (objHana, propOfilter, propObjHana, propItem) => {
  const aValues = JSON.parse(objHana[propObjHana]);
  const aFiltersValues = aValues.filter((item) => (item.status))
    .map((item) => (`${_assembleFilterGeneric(propOfilter, item[propItem])} or`));
  console.log(aFiltersValues)
  return aFiltersValues.join('').slice(0, -3);
};
const PAGE_SIZE = 200000;
const App = () => {
  const loadData = async (isFirstLoad, skip = 0) => {
    setLoading(true);
    setMaterials([]);
    const usersS4 = await getUserHana({ $filter: `documentId eq '03680252000105'` });
    try {
      if (isFirstLoad) {

        setPermission(usersS4 !== undefined ? usersS4.validatedPetro : 'nao_cadastrado');
      }


      if (usersS4 !== undefined) {
        // const user = await getUserLogged();
        // const usersS4 = await getUsersS4Data();
        // const usersS4 = await getUserHana({$filter: `documentId eq '03680252000105'`});
        const sFiltersClasses = _assembleOrFilterGeneric(usersS4, 'classDesc', 'class','class');
        const sFiltersManufactureres = _assembleOrFilterGeneric(usersS4, 'mfrnr', 'manufacturer','text');
        const sFilter = `fornecedorInex eq '10097577'and (${sFiltersClasses}) and (${sFiltersManufactureres})`
        // const sFilter = `fornecedorInex eq '10097577'`
        const countRecog = await getCountIndicator({
          $filter: `${sFilter} and NmReconhecido eq 'Comercializo'`
        });
        const countNotRecog = await getCountIndicator({
          $filter: `${sFilter} and NmReconhecido eq 'Não Comercializo'`
        });
        const countPriceAta = await getCountIndicator({
          $filter: `${sFilter} and AtaPrecoPreenchida eq 'true'`
        });
        const countTecInfo = await getCountIndicator({
          $filter: `${sFilter} and InformacoesTecnicas eq 'true'`
        });
        setCountIndicators({
          recog: countRecog,
          notRecog: countNotRecog,
          priceATA: countPriceAta,
          tecInfo: countTecInfo
        });

        const _items = await getTableData({
          $top: PAGE_SIZE,
          // $skip: skip,
          $filter: sFilter
        });
        const itemsWithIds = _items.map((item, index) => {
          item.id = index;
          return item;
        });
        setMaterials(itemsWithIds);

      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData(true);
  }, []);
  const [permission, setPermission] = useState(null);
  const [countIndicators, setCountIndicators] = useState({
    recog: 0,
    notRecog: 0,
    priceATA: 0,
    tecInfo: 0
  });
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState(null);
  return (
    <div className="App">
      <Header />

      {permission === 'concluido' ? (
        <div className="body">
          <Indicators recog={countIndicators.recog} notRecog={countIndicators.notRecog}
            priceATA={countIndicators.priceATA} tecInfo={countIndicators.tecInfo} />
          <MainTableMaterial materials={materials} loading={loading} loadData={loadData} />
        </div>
      ) : (
        <TelaErroPermissao />
      )}

    </div>
  );
};

export default App;
