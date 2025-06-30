
import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { useDashboard } from '../../useContext';
import { getTecInfoMaterial } from "../../api";

const filter = createFilterOptions();

export default function FreeSoloCreateOption({ data }) {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const { cacheFieldValues, setCacheFieldValues,
     selectedMaterialsMastDet, setSelectedMaterialsMastDet, setFieldValueMatSelect } = useDashboard();
  const [options, setOptions] = useState([]);

  const handleClickOpen = async (bool, oEntry) => {
    setLoading(true);
    if (bool) {
      let findedInCache = cacheFieldValues.find((item) => (item.field === oEntry.Caracteristica));
      if (!findedInCache) {
        const filter = `Nm eq '${oEntry.Nm}' and Caracteristica eq '${oEntry.Caracteristica}'`
        const valuesFieldTec = await getTecInfoMaterial({
          $filter: filter,
          $expand: 'to_Char4Class'
        });
        findedInCache = {
          field: oEntry.Caracteristica,
          values: [...valuesFieldTec[0]?.to_Char4Class.results || valuesFieldTec]
        }
        setCacheFieldValues([...cacheFieldValues, findedInCache])
      }

      const uniqueObjects = findedInCache.values.reduce((accumulator, current) => {
        const objString = JSON.stringify(current.Valor);
        if (!accumulator.seen.has(objString)) {
          accumulator.unique.push(current);
          accumulator.seen.add(objString);
        }
        return accumulator;
      }, { unique: [], seen: new Set() }).unique;
      setOptions(uniqueObjects);

    }
    setLoading(false);
  };
  useEffect(() => {
    handleClickOpen(true, data);
  }, []);
  return (
    <Autocomplete
      loading={loading}
      value={value}
      size="small"
      onChange={(event, newValue) => {
        let valuePropous = ''
        if (typeof newValue === 'string') {
          setValue({
            Valor: newValue,
          });
          valuePropous = newValue;
          
        } else if (newValue && newValue.inputValue) {
          setValue({
            Valor: newValue.inputValue,
          });
          valuePropous = newValue.inputValue;
        } else {
          setValue(newValue);
          valuePropous = newValue;
        }
        const oValue = selectedMaterialsMastDet.fields
        .filter((item)=>item.Caracteristica === data.Caracteristica && item.PosCarac === data.PosCarac)[0]
        oValue['NovoValor'] = valuePropous.Valor
        setFieldValueMatSelect(oValue);

      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.Valor);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            Valor: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.Valor;
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.Valor}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField sx={{width: '80%'}}{...params} placeholder="Pesquisar" />
      )}
    />
  );
}