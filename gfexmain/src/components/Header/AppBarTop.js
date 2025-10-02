import React, { useState } from 'react';

import {
  AppBar, Toolbar, Box, IconButton, Menu,
  MenuItem as MenuItemComponent, Avatar, Typography
} from "@mui/material"
import {
  Menu as MenuIcon,
  AccountCircle,
} from "@mui/icons-material";
import logopetrobras from '../../assets/logopetrobras.png';
import logoSimpleGFEx from '../../assets/logoSimpleGFEx.png';
import UserInfoModal from '../../components/modal/UserInfo';
import { useAuth } from '../../useContext/AuthContext';



export default function AppBarTop({ typeHeader, value: { setDrawerOpen, anchorEl, setAnchorEl } }) {
  const [openUserInfo, setopenUserInfo] = useState(false);
  const { user } = useAuth();
  console.log(typeHeader)
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
    <AppBar position="sticky" elevation={0} sx={{
      backgroundColor: '#fff',
      borderBottom: '4px solid #4CAF50',
    }}>
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        {typeHeader !== 'AccessReq' && (<IconButton
          size="large"
          edge="start"
          sx={{ mr: 1, color: "text.primary" }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>)}


        <img src={logoSimpleGFEx} />
        <Typography
          variant="h6"
          component="div"
          sx={{
            color: 'rgb(0,133,66)',
            flexGrow: 1,
            fontWeight: 600,
            fontFamily: "PetrobrasSans_It",
            marginLeft: 1.5,
            marginTop: '3px'
          }}
        >
          Gestão para Fornecedores Exclusivos
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {typeHeader !== 'AccessReq' && (<><Box sx={{ display: 'flex', marginInline: '15px' }}>


          <IconButton onClick={handleMenuClick} sx={{ color: "text.primary" }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "secondary.main", fontSize: "0.895rem" }}>
              {user.email.split(" ")[0][0].toUpperCase()}
            </Avatar>
          </IconButton>
        </Box> <Menu
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

          </Menu></>)}


        <img src={logopetrobras} style={{ height: '30px' }} />
      </Toolbar>
      {typeHeader !== 'AccessReq' && (<UserInfoModal open={openUserInfo} handleClose={() => handleCloseUserInfo()} data={user} />)}
    </AppBar>
  );
}