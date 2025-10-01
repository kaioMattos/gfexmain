import React, { useEffect, useState } from 'react';
import { ToggleButton, ToggleButtonGroup, Alert, List, Grid } from '@mui/material';
import EachItem from "../../../components/list/EachItem";
import { PiFactory } from "react-icons/pi";
import { useAuth } from '../../../useContext/AuthContext';

import DeleteIcon from '@mui/icons-material/Delete'; 
import UndoIcon from '@mui/icons-material/Undo';
import { wizardStyles } from './wizardStepCss';

export default function ManufacturerForm() {
  const [toggleButton, setToggleButton] = useState(true);
  const { user, setManufacturer, setManufClass, setActiveNext } = useAuth();

  const toDoDeleteHandler = (oManufacturer) => {
    const updatedManufac = user.infoS4H.manufacturer.map((manufacturer) => {
      if (oManufacturer.text === manufacturer.text) {
        manufacturer.status = !toggleButton;
      }
      return manufacturer
    })
    setManufacturer(updatedManufac);
    const aCltClass = user.infoS4H.class.map((item) => {
      if (item.ManufacturerNumber === oManufacturer.ManufacturerNumber) {
        const removeClass = !toggleButton ? true : '';
        return { ...item, status: removeClass }
      }
      return item
    });
    setManufClass([...aCltClass]);
  };

  const loadData = async () => {
    const disabledButtonNext = !user.infoS4H.manufacturer.filter((item) => item.status).length;
    setActiveNext(disabledButtonNext);
  }
  useEffect(() => {
    loadData();
  }, [])
  
  const handleChange = (event, newAlignment) => {
    setToggleButton(newAlignment === 'comercializo' ? true : false);
  };
  return (
    <React.Fragment>
      <Grid container style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Grid item size={8} sx={{ textAlign: 'left' }} container>
          <Alert 
            severity="info"
            style={{
              marginBottom: '20px',
            }}>
            Para os CNPJs comerciais, foram encontrados os seguintes fabricantes:
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
      <Grid item size={12} className={wizardStyles.list} container  justifyContent="center" alignItems="center">
        <List
          style={{
            width: '100%',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 250,
          }}>
          {user.infoS4H.manufacturer
            .filter((manufacturer) => (manufacturer.status === toggleButton))
            .map((manufacturer) => {
              return (
                <EachItem
                  iconButtonHandler={toggleButton ? <DeleteIcon style={{ color: 'gray' }} /> : <UndoIcon color="primary" />}
                  toDoDeleteHandler={toDoDeleteHandler}
                  key={manufacturer.text}
                  oItem={manufacturer}
                  icon={<PiFactory style={{ fontSize: 23 }} />}
                  showManufacturerNumber={false}
                />
              );
            })}
        </List>
      </Grid>
    </React.Fragment>
  );
}