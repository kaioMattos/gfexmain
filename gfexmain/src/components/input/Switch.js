import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { useDashboard } from '../../useContext';

const TextSwitch = styled(Switch)(({ theme }) => ({
  width: 75,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 1,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(36px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: 'rgb(0,142,145)',
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 32,
    height: 32,
  },
  '& .MuiSwitch-track': {
    borderRadius: 20 / 2,
    backgroundColor: '#ccc',
    opacity: 1,
    position: 'relative',
    '&::before, &::after': {
      content: '"Sim"',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: 12,
      color: '#fff',
    },
    '&::after': {
      content: '"Não"',
      right: 6,
    },
    '&::before': {
      left: 5,
    },
  },
}));

export default function SwitchWithText({data, dataRow}) {
  let check = dataRow?.Agreed
  const { selectedMaterialsMastDet, setAFieldsValueMatSelect,setFieldValueMatSelect } = useDashboard();
  
  const handleChange = (event) => {
    console.log(check)
    if(data === 'all'){
      selectedMaterialsMastDet.fields
      .map((item)=>(setFieldValueMatSelect({...item,Agreed: event.target.checked})));
      check =  event.target.checked
      // setAFieldsValueMatSelect(aEntry);
    }else{
      console.log(data, selectedMaterialsMastDet.fields)
      const oValue = selectedMaterialsMastDet.fields
      .filter((item) => item.PosCarac === dataRow.PosCarac)[0];
      oValue['Agreed'] = event.target.checked;
      setFieldValueMatSelect(oValue);
    }
    // setChecked(event.target.checked);
  };

  return (
    <TextSwitch checked={check} onChange={handleChange} />
  );
}
