import AppBarTop from "./AppBarTop";
import DrawerNavigation from "./DrawerNavigation";
import { useState } from "react"

export default function NewHeader() {

  // Estados da UI
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  
  return (
   <>
   <AppBarTop value={{drawerOpen,setDrawerOpen,anchorEl,setAnchorEl,currentPage,setCurrentPage}}/>
   <DrawerNavigation value={{drawerOpen,setDrawerOpen,anchorEl,setAnchorEl,currentPage,setCurrentPage}}/>
   </>
  );
}