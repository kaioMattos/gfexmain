import React from 'react';
import { Switch, Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';



export default function TextSwitch({ value, onChange }) {
  const handleToggle = (event) => {
    onChange && onChange(event.target.checked);
  };

  return (
    <Box display="flex" alignItems="center" gap={0.3}>
      <CancelIcon color={!value ? 'error' : 'disabled'} />
      {/* <Typography color={!value ? 'error' : 'textSecondary'}>Não</Typography> */}
      <TextSwitch checked={value} onChange={handleToggle} />
      <CheckCircleIcon color={value ? 'success' : 'disabled'} />
      {/* <Typography color={value ? 'success.main' : 'textSecondary'}>Sim</Typography> */}
    </Box>
  );
}
