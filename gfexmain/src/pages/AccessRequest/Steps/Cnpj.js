import React, { useEffect, useState } from 'react';
import EachItem from "../../../components/list/EachItem";
import { PiUserCircleFill } from "react-icons/pi";
import { useAuth } from '../../../useContext/AuthContext';

import { getSupplier, getManufacturer, getClass } from '../../../api'
import { CircularProgress, Collapse, Alert, Grid, List, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { _assembleOrFilterGeneric, removeDuplicatesFromArray } from '../../../utils';
import { InputText } from 'primereact/inputtext';
import { Button as MuiButton } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { wizardStyles } from './wizardStepCss';

export default function CnpjForm() {
  const { user,  setActiveNext, setAssembleInitDataPerCnpj } = useAuth();
  const [state, setState] = useState({ error: false, inputCnpj: "" });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });

  const assembleManufacturer = async (sCnpj) => {
    const oData = await getManufacturer({
      filter: `DocumentId eq '${sCnpj}'`,
      expand: "toManu"
    });
    const manufacturer = oData.flatMap((item) => {
      return item.toManu.map((manu) => ({
        status: true,
        text: manu.mfrnr,
        ManufacturerNumber: manu.mfrnr,
        DocumentId: sCnpj
      }))
    })
    return [...user.infoS4H.manufacturer, ...manufacturer];
  }

  const assembleClass = async (aCollectionManufacturer) => {
    const sFiltersCnpj = _assembleOrFilterGeneric({manufacturer:aCollectionManufacturer}, 'ManufacturerNumber', 'manufacturer','ManufacturerNumber');
    const oData = await getClass({
      filter: `${sFiltersCnpj}`,
      top: 1000
    });      
    
    const classCollection = oData.map((item) => ({
      numberClass: item.Class,
      class: item.ClassDescription,
      text: `${item.Class} - ${item.ClassDescription}`,
      ManufacturerNumber: item.ManufacturerNumber,
      status: true
    }))
    const _class = removeDuplicatesFromArray(classCollection);
    return [...user.infoS4H.class, ..._class]
  }

  const addToDoHandler = async (e) => {
    e.preventDefault();
    const sCnpj = state.inputCnpj;
    const cnpjExistInList = !user.infoS4H.cnpj.find((item) => item.DocumentId === sCnpj);
    if (sCnpj !== "" && cnpjExistInList) {
      try {
        setLoading(true)
        const fornecedor = await getSupplier({
          filter: `DocumentId eq '${sCnpj}'`
        });
        if (!!Object.values(fornecedor).length) {

          const aCollectionCnpj = [...user.infoS4H.cnpj, {
            text: `${fornecedor.SupplierId} - ${fornecedor.SupplierName}`,
            lifnr: fornecedor.SupplierId,
            DocumentId: fornecedor.DocumentId,
            status: true
          }];   
          const aCollectionManufacturer = await assembleManufacturer(sCnpj);
          const aCollectionClass = await assembleClass(aCollectionManufacturer);

          setAssembleInitDataPerCnpj(aCollectionCnpj, aCollectionManufacturer, aCollectionClass);
          setState(prev => ({ ...prev, inputCnpj: "", error: false }));
        } else {
          setSnackbar({ open: true, message: "Fornecedor não encontrado", severity: "error" });
          setState(prev => ({ ...prev, error: true }));
        }
      } catch (error) {
        setSnackbar({ open: true, message: "Fornecedor não encontrado", severity: "error" });
        setState(prev => ({ ...prev, error: true }));
      } finally {
        setLoading(false);
      }

    } else {
      if(sCnpj == ""){
        setSnackbar({ open: true, message: "Digite um CNPJ válido", severity: "error" });
      }
      else{
        setSnackbar({ open: true, message: "CNPJ já adicionado", severity: "error" });
      }
      setState(prev => ({ ...prev, error: true }));
    }
  };


  const inputHandler = (e) => {
    setState({
      [e.currentTarget.name]: e.currentTarget.value,
      error: e.currentTarget.value === "" ? true : false
    });
  };

  const toDoDeleteHandler = (oCnpj) => {
    const aCltCnpj = user.infoS4H.cnpj.filter((element) => element.DocumentId !== oCnpj.DocumentId);
    const aCltManuf = user.infoS4H.manufacturer.filter((item) => (item.DocumentId !== oCnpj.DocumentId));
    const retiredManufacturer = user.infoS4H.manufacturer.filter((item) => (item.DocumentId === oCnpj.DocumentId));
    const aCltClass = user.infoS4H.class.filter((item) => {
      const finded = !retiredManufacturer.find((manufacturer) => (manufacturer.ManufacturerNumber === item.ManufacturerNumber));
      return finded
    });
    setAssembleInitDataPerCnpj(aCltCnpj, aCltManuf, aCltClass);
    setState((prev) => ({ ...prev, error: false }));
  };

  useEffect(() => {
    if (!!user.infoS4H.cnpj.length)
      setActiveNext(false);
  }, [])

  return (
    <React.Fragment>
      <form onSubmit={addToDoHandler}>
          <Grid container spacing={3} direction="column">
  <Grid item xs={12} sm={12}>
    {/* Input + botão */}
    <div className="flex flex-column gap-2" style={{ textAlign: 'left', color: 'rgb(77, 77, 77)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <InputText
          id="cnpj"
          name="inputCnpj"
          invalid={state.error}
          value={state.inputCnpj}
          onChange={inputHandler}
          placeholder="Digite o CNPJ"
          style={{ flexGrow: 1, maxWidth: '250px' }}
        />
        <MuiButton
          variant="contained"
          onClick={addToDoHandler}
          endIcon={<AddBoxIcon />}
          style={{ backgroundColor: 'rgb(40, 140, 100)', color: 'white', minWidth: 'auto', padding: '8px 12px' }}
        >
          Adicionar
        </MuiButton>
      </div>
      <small id="cnpjInput-help">
        Tecle enter para Adicionar
      </small>
    </div>
  </Grid>
  <Grid item xs={12} className={wizardStyles.list} sx={{ mt: 2 }}>
    {/* Lista */}
    {loading ? (
      <CircularProgress disableShrink={loading} />
    ) : (
      <List
        style={{
          width: '100%',
          position: 'relative',
          overflow: 'auto',
          maxHeight: 250,
        }}
      >
        {user.infoS4H.cnpj.map((cnpj) => {
          return (
            <EachItem
              iconButtonHandler={<DeleteIcon style={{ color: 'gray' }} />}
              toDoDeleteHandler={toDoDeleteHandler}
              key={cnpj.id}
              oItem={cnpj}
              icon={<PiUserCircleFill style={{ fontSize: 23 }} />}
            />
          );
        })}
      </List>
    )}
  </Grid>
</Grid>

      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}