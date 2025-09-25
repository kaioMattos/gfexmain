import React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Box
} from "@mui/material";

// ✅ Certifique-se de usar ícones do @mui/icons-material
import DeleteIcon from '@mui/icons-material/Delete';

const EachItem = ({
  oItem,
  toDoDeleteHandler,
  icon,
  iconButtonHandler,
  showManufacturerNumber
}) => {
  return (
    <>
      <ListItem
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2
        }}
      >
        {/* Ícone principal */}
        <ListItemIcon sx={{ color: 'rgb(0,98,152)', minWidth: 40 }}>
          {icon}
        </ListItemIcon>

        {/* Texto principal */}
        <Box sx={{ flex: 3, mr: 2 }}>
          <ListItemText
            primary={oItem.text}
            primaryTypographyProps={{ fontSize: '0.9rem' }}
          />
        </Box>

        {/* Número do fabricante (opcional) */}
        {showManufacturerNumber && (
          <Box sx={{ flex: 2, mr: 2 }}>
            <ListItemText
              primary={oItem.ManufacturerNumber}
              primaryTypographyProps={{ fontSize: '0.9rem' }}
            />
          </Box>
        )}

        {/* Botão de ação */}
        <ListItemSecondaryAction>
          <IconButton
            onClick={() => toDoDeleteHandler(oItem)}
            edge="end"
            aria-label="delete"
          >
            {iconButtonHandler ?? <DeleteIcon />}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>

      {/* Divisor abaixo de cada item */}
      <Divider variant="inset" component="li" />
    </>
  );
};

export default EachItem;
