import {
  Dashboard,
  Inventory,
  Assignment,
  Engineering,
  TableChart
} from "@mui/icons-material";

import { useDashboard } from '../../../useContext';

const NavigationItems = () => {
  const { supplier } = useDashboard();
  let navigationItems = []
  if (!supplier.userPetro) {
    return [
      { text: "Dashboard", icon: <Dashboard />, path: "/index.html" },
      { text: "Comercialização", icon: <Inventory />, path: "/Marketing" },
      { text: "Minuta Contratual", icon: <Assignment />, path: "/contratos" },
      { text: "Info. Técnicas", icon: <Engineering />, path: "/TecInfo" },
    ]
  } else {
    return [
      { text: "Relatório", icon: <TableChart />, path: "/Report" }
    ]
  }
}

export {NavigationItems}