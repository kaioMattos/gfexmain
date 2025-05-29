import * as React from 'react';
import { Typography , Breadcrumbs, Link} from '@mui/material';
import {  useLocation, useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";

export default function NavLink() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    
    <div >
      {!location.pathname.includes("/index.html") && (
      <Breadcrumbs aria-label="breadcrumb" sx={{marginBottom:'0.5%'}}>
     
        <Link
          onClick={() => navigate('/dashboardgfex/index.html')}
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="#"
        >
          <IoHomeOutline sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
    
        {location.pathname.includes("/TecInfo") && (
          <>
            <Typography sx={{ color: 'text.primary' }}>Informações Técnicas</Typography>                        
          </>
        )}
      </Breadcrumbs>
       )}
    </div>
 
  );
}