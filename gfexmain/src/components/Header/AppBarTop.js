import React, { useState } from 'react';

import {
  AppBar, Toolbar, Box, IconButton, Menu,
  MenuItem as MenuItemComponent, Avatar,
} from "@mui/material"
import {
  Menu as MenuIcon,
  AccountCircle,
} from "@mui/icons-material";
import logopetrobras from '../../assets/logopetrobras.png';
import logoSimpleGfex from '../../assets/logoSimpleGfex.png';
import UserInfoModal from '../../components/modal/UserInfo';
import { useDashboard } from '../../useContext';
import { useAuth } from '../../useContext/AuthContext';



export default function AppBarTop({value:{ setDrawerOpen, anchorEl, setAnchorEl}}) {
  const [openUserInfo, setopenUserInfo] = useState(false);
   const { supplier } = useDashboard();
   const { user } = useAuth();
  console.log(user)

   const handleCloseUserInfo = () => {
    setopenUserInfo(false);
  };
  const setOpenUserInfoDialog = () => {
    setopenUserInfo(true);
    handleMenuClose();
  }
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", borderBottom: "1px solid #e2e8f0" }}>
    <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
      <IconButton
        size="large"
        edge="start"
        sx={{ mr: 2, color: "text.primary" }}
        onClick={() => setDrawerOpen(true)}
      >
        <MenuIcon />
      </IconButton>

      <img src={logoSimpleGfex} />

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: 'flex', marginInline: '10px' }}>
       

        <IconButton onClick={handleMenuClick} sx={{ color: "text.primary" }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: "secondary.main", fontSize: "0.895rem" }}>
          {supplier.email.split(" ")[0][0].toUpperCase()}
          </Avatar>
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItemComponent onClick={() => { setOpenUserInfoDialog() }} >
          <AccountCircle sx={{ mr: 1 }} />
          Meu Perfil
        </MenuItemComponent>

      </Menu>
      <img src={logopetrobras} style={{ height: '30px' }} />
    </Toolbar>
    <UserInfoModal open={openUserInfo} handleClose={() => handleCloseUserInfo()} data={supplier}/>
  </AppBar>
  );
}