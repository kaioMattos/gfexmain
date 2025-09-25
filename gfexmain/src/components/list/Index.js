import React from 'react';
import { List } from '@mui/material';
import EachItem from "./EachItem";
import DeleteIcon from '@mui/icons-material/Delete'; 
import UndoIcon from '@mui/icons-material/Undo';

export default function CustomList({aValues, haveIconAction, activeItems, toDoDeleteHandler, icon, propKey}) {
  return (
    <List style={{
      width: '100%',
      position: 'relative',
      overflow: 'auto',
      maxHeight: 250,
    }}>
      {aValues
        .filter((item) => (item.status === activeItems))
        .map((item) => {
          return (
            <EachItem

              iconButtonHandler={haveIconAction ?
                activeItems ? <DeleteIcon color="error" /> : <UndoIcon color="primary" /> : ''
              }
              toDoDeleteHandler={toDoDeleteHandler}
              key={item[propKey]}
              oItem={item}
              icon={icon}
            />

          );
        })}
    </List>
  );
}
