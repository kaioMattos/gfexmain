import React ,{ useState, useEffect } from "react"
import {
  Typography, Box, MenuItem as MenuItemComponent, Drawer,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Dashboard, Inventory, Assignment, Engineering, Business, TableChart
} from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../../useContext';

export default function DrawerNavigation( {value:{drawerOpen, setDrawerOpen, currentPage, setCurrentPage}} ) {
  // Itens do menu de navegação
  const navigate = useNavigate();
    const [navigationItems, setNavigationItems] = useState([])
    const { supplier } = useDashboard();
  
  const handleNavigationClick = (item) => {
    setCurrentPage(item.text);
    setDrawerOpen(false);
    navigate(item.path);
  }
  const getItemsDrawer = ()=>{
    let items = []
    if(supplier.userPetro){
      items = [{ text: "Relatório", icon: <TableChart />, path: "/Report" }]
    }else{
      items = [
        { text: "Dashboard", icon: <Dashboard />, path: "/index.html" },
        { text: "Comercialização", icon: <Inventory />, path: "/Marketing" },
        { text: "Minuta Contratual", icon: <Assignment />, path: "/contratos" },
        { text: "Info. Técnicas", icon: <Engineering />, path: "/TecInfo" }
      ]
    }
    setNavigationItems(items)
  }
  useEffect(() => {
    getItemsDrawer(true);
  }, []);
  return (
    <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
      <Box sx={{ width: 280 }}>
        <Box sx={{ p: 3, bgcolor: "primary.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Business sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Plataforma do Fornecedor
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Sistema de Gestão de Materiais
          </Typography>
        </Box>
        <List sx={{ pt: 2 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ px: 2 }}>
              <ListItemButton
                selected={currentPage === item.text}
                onClick={() => handleNavigationClick(item)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  "&.Mui-selected": {
                    bgcolor: "secondary.light",
                    color: "white",
                    "&:hover": {
                      bgcolor: "secondary.main",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: currentPage === item.text ? "white" : "text.secondary",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: currentPage === item.text ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}