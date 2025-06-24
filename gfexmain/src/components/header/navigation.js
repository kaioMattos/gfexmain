import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import { FiMenu } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const navigatePage = (page) => {
    navigate(page);
    handleClose();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
        <IconButton
        style={{fontSize: '1rem', fontFamily: 'PetrobrasSans_Bd', marginLeft:'2rem'}}
        aria-label="more"
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <FiMenu style={{marginRight:'5%', fontSize:'1.3rem'}}/>
        Navegar
      </IconButton>
      
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => navigatePage('/gfexmain/index.html')}>Home</MenuItem>
        <MenuItem onClick={() => navigatePage('/gfexmain/Marketing')}>Comercialização</MenuItem>
        <MenuItem onClick={() => navigatePage('/gfexmain/TecInfo')}>Aprovar Ficha Técnica</MenuItem>
        <MenuItem onClick={() => navigatePage('a')}>Minuta Contratual</MenuItem>        
      </Menu>
    </div>
  );
}
