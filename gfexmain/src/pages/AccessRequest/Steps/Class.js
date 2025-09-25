import React, { useEffect, useState } from 'react';
import { ToggleButton, ToggleButtonGroup, Alert, List, ListSubheader, Grid } from '@mui/material';
import EachItem from "../../../components/list/EachItem";
import { MdOutlineClass } from "react-icons/md";
import { useAuth } from '../../../useContext/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete'; 
import UndoIcon from '@mui/icons-material/Undo';
import { wizardStyles } from './wizardStepCss';

export default function ClassForm() {
  const [toggleButton, setToggleButton] = useState(true);
  const { user, setClass, setActiveNext } = useAuth();

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }, []);

  const manufacturerNameMap = user.infoS4H.manufacturer.reduce((acc, mfg) => {
      acc[mfg.ManufacturerNumber] = mfg.text; // Assumindo que mfg.text é o nome legível
      return acc;
  }, {});

  const loadData = async () => {
    const disabledButtonNext = !user.infoS4H.class.filter((item) => item.status).length
    setActiveNext(disabledButtonNext)
  }

  const toDoDeleteHandler = (oClass) => {
    const updatedClass = user.infoS4H.class.map((_class) => {
      if (oClass.numberClass === _class.numberClass) {
        _class.status = !toggleButton
      }
      return _class
    })
    setClass(updatedClass);
  };

  useEffect(() => {
    loadData()
  }, [])
  const handleChange = (event, newAlignment) => {
    setToggleButton(newAlignment === 'comercializo' ? true : false);
  };

  const groupedData = user.infoS4H.class
  .filter((_class) => _class.status === toggleButton) // Filtra os itens com base no botão ativo
  .reduce((acc, curr) => {
    const manufacturerNumber = curr.ManufacturerNumber;
    if (!acc[manufacturerNumber]) {
      acc[manufacturerNumber] = [];
    }
    acc[manufacturerNumber].push(curr);
    return acc;
  }, {});

  return (
    <React.Fragment>
      <Grid container >
        <Grid item size={8} sx={{ textAlign: 'left' }} container>
          <Alert severity="info">
            Para os Fabricantes comercializados, foram encontradas as seguintes classes:
          </Alert>
        </Grid>
        <Grid item size={4} sx={{ textAlign: 'right' }}>
          <ToggleButtonGroup
            color="primary"
            value={toggleButton ? 'comercializo' : 'nComercializo'}
            exclusive
            onChange={handleChange}
            size="small"
          >
            <ToggleButton value="comercializo" style={{ padding: '10px' }}>comercializo</ToggleButton>
            <ToggleButton value="nComercializo" style={{ padding: '10px' }}>Não comercializo</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <Grid item size={12} className={wizardStyles.list}>
        <List
          style={{
            width: '100%',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 250,
          }}
        >
          {Object.keys(groupedData).map((manufacturerNumber) => (
            <React.Fragment key={manufacturerNumber}>
              <ListSubheader 
                style={{ fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'left', color: 'rgb(40, 140, 100)' }}
                disableSticky >
                {manufacturerNameMap[manufacturerNumber] || manufacturerNumber}
              </ListSubheader>
              {groupedData[manufacturerNumber].map((_class) => (
                <EachItem
                  iconButtonHandler={toggleButton ? <DeleteIcon style={{ color: 'gray' }} /> : <UndoIcon color="primary" />}
                  toDoDeleteHandler={toDoDeleteHandler}
                  key={_class.id}
                  oItem={_class}
                  icon={<MdOutlineClass style={{ fontSize: 23 }} />}
                  showManufacturerNumber={false}
                />
              ))}
            </React.Fragment>
          ))}
        </List>
      </Grid>
    </React.Fragment>
  );
}