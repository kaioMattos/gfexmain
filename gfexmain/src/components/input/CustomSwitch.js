import React, { useState } from 'react';
import TextSwitch from './TextSwitch';
import { useDashboard } from '../../useContext';

export default function CustomUISwitch({ data, dataRow }) {
  let check = dataRow?.Agreed
  const { selectedMaterialsMastDet, setAFieldsValueMatSelect,setFieldValueMatSelect } = useDashboard();
  const handleChange = (event) => {
    if (data === 'all') {
      selectedMaterialsMastDet.fields
        .map((item) => (setFieldValueMatSelect({ ...item, Agreed: event })));
      check = event
      // setAFieldsValueMatSelect(aEntry);
    } else {
      const oValue = selectedMaterialsMastDet.fields
        .filter((item) => item.PosCarac === dataRow.PosCarac)[0];
      oValue['Agreed'] = event;
      setFieldValueMatSelect(oValue);
    }
    // setChecked(event.target.checked);
  };
  return (
    <div>
      <TextSwitch value={check} onChange={handleChange} />
    </div>
  );
}
