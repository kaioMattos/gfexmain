import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Box, Grid } from '@mui/material';
import Head from '../../components/head';
import IndicatorMkt from './indicators/Marketing';
import IndicatorPriceAta from './indicators/PriceAta';
import { postRecogMat } from "../../api";
import { useDashboard } from '../../useContext';
import TableInfo from '../../components/table/TableInfo';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { TfiSave } from "react-icons/tfi";
import { _assembleOrFilterGeneric, getDateIsoString } from '../../utils';
import "./styles.css";

const PAGE_SIZE = 200000;

const Marketing = () => {
  // const loadData = async () => {
  //   setMaterials([]);
  //   await setSelectedMaterialsContext([])
  //   try {
  //     setLoadingPage(true);
  //     if (supplier !== undefined) {
  //       const sFiltersClasses = _assembleOrFilterGeneric(supplier, 'classDesc', 'class', 'class');
  //       const sFiltersManufactureres = _assembleOrFilterGeneric(supplier, 'mfrnr', 'manufacturer', 'text');
  //       const sFilter = `fornecedorInex eq '10097577'and (${sFiltersClasses}) and (${sFiltersManufactureres})`
  //       const countRecog = await getCountIndicator({
  //         $filter: `${sFilter} and NmReconhecido eq 'Comercializo'`
  //       });
  //       const countNotRecog = await getCountIndicator({
  //         $filter: `${sFilter} and NmReconhecido eq 'Não Comercializo'`
  //       });
  //       const countNotIdentify = await getCountIndicator({
  //         $filter: `${sFilter} and (NmReconhecido ne 'Não Comercializo' and NmReconhecido ne 'Comercializo')`
  //       });

  //       const countPriceAta = await getCountIndicator({
  //         $filter: `${sFilter} and AtaPrecoPreenchida eq 'Preenchido' and NmReconhecido eq 'Comercializo'`
  //       });

  //       const countPriceAtaNeedToFill = await getCountIndicator({
  //         $filter: `${sFilter} and AtaPrecoPreenchida eq 'Preencher' and NmReconhecido eq 'Comercializo'`
  //       });
  //       setCountIndicators({
  //         recog: countRecog,
  //         notRecog: countNotRecog,
  //         priceATA: countPriceAta,
  //         priceATAFill: countPriceAtaNeedToFill,
  //         notIdentify: countNotIdentify
  //       });

  //       const _items = await getTableData({
  //         $top: PAGE_SIZE,
  //         $filter: sFilter
  //       });
  //       const itemsWithIds = _items.map((item, index) => {
  //         item.id = index;
  //         return item;
  //       });
  //       setMaterials(itemsWithIds);

  //     }
  //   } finally {
  //     setLoadingPage(false);
  //   }
  // }

  const recogMaterial = async () => {
      let aPromises = [];
      const recog = selectedAction === 'Comercializo' ? 'CMR' : 'NCM';
      const priceAta = selectedAction === 'Comercializo' ? 'FPR' : 'NAP';
      const tecInfo = selectedAction === 'Comercializo' ? 'FVL' : 'NAP';
      const aEntry = selectedMaterials.map((material) => ({
        "Nm": material.matnr,
        "DataCriacao": null,
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
      aPromises = aEntry.map((oEntry) => (postRecogMat(oEntry)));
      const resolvedPromises = await Promise.all(aPromises);
      loadData(false);
    }

  const { countIndicators, loadData, materials, loadingPage, selectedMaterials, setSelectedMaterialsContext } = useDashboard();
 
  const [selectedAction, setSelectedAction] = useState(null);
  const massActions = ['Comercializo', 'Não Comercializo'];

  const GridHeaderTable = () => (
    <>
      <Grid>
        <Dropdown value={selectedAction} style={{ marginLeft: '10px' }} onChange={(e) => setSelectedAction(e.value)} options={massActions} optionLabel="name"
          placeholder="Selecione a ação" className="w-full md:w-16rem" />
      </Grid>
      <Grid>
        <Button disabled={selectedAction !== null ? false : true} style={{ marginLeft: '10px' }}
         icon={<TfiSave size={20} />} outlined severity="success"
         onClick={() => recogMaterial()} aria-label="Search" />
      </Grid>
    </>
  );

  const Highlight = ({ children, className }) => (
    <span className={className}>
      {children}
    </span>
  );
  useEffect(() => {
    // loadData();
  }, []);

  return (
    <div className='bodyPage'>
      <Head title="Comercialização - Gfex" description="Comercializar Material" />
      {loadingPage ? (
        <div className="initLoading">
          <CircularProgress disableShrink={loadingPage} />
        </div>
      ) : (
        <>
          <Grid container>
            <Box sx={{ paddingTop: '5px' }}>
              <Typography variant='subtitle1' sx={{ color: 'rgb(0,142,145)', textAlign: 'left' }}>
                Olá EMERSON,
              </Typography>
              <Typography sx={{ color: 'rgb(0,142,145)', textAlign: 'left' }}>
                Materiais encontrados <Highlight className="destTotalMat">{countIndicators.comercializacao.total}</Highlight>.
              </Typography>
            </Box>
          </Grid>
          <Grid sx={{ textAlign: 'center', marginTop: '1.5%' }}>
            <Grid container spacing={3} >
              <Grid item size={8} >
                <Grid style={{
                  backgroundColor: 'white',
                  padding: '1%',
                  borderRadius: '6px',
                  minHeight: '100%'
                }} >
                  <Grid item size={12}>
                    <Box>
                      <Typography sx={{ color: 'black', textAlign: 'left', padding: '8px' }}>
                        Comercialização
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item size={12} style={{ borderTop: '3px solid rgb(0,142,145)', minHeight: '90%' }}>
                    <Grid style={{ padding: '1%' }}>
                      <IndicatorMkt recog={countIndicators.comercializacao.recog} 
                        notRecog={countIndicators.comercializacao.notRecog} 
                        notIdentify={countIndicators.comercializacao.notIdentify} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item size={4} >
                <Grid style={{
                  backgroundColor: 'white',
                  padding: '1%',
                  borderRadius: '6px',
                  minHeight: '100%'
                }} >
                  <Grid item size={12}>
                    <Box>
                      <Typography sx={{ color: 'black', textAlign: 'left', padding: '8px' }}>
                        Ata de Preço
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item size={12} style={{ borderTop: '3px solid rgb(0,142,145)', minHeight: '90%' }}>
                    <Grid style={{ padding: '1%' }}>
                      <IndicatorPriceAta filled={countIndicators.ataPreco.filled} notIdentify={countIndicators.ataPreco.notFilled} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <TableInfo materials={materials} loading={loadingPage} loadData={loadData}
            sActionHeader='Identificar'
            HeaderTable={<GridHeaderTable />} />
        </>)}</div>
  );
};

export default Marketing;
