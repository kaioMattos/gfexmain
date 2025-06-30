import React from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const TextSwitch = styled(Switch)(({ theme }) => ({
  width: 70,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 1,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(36px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 32,
    height: 32,
  },
  '& .MuiSwitch-track': {
    borderRadius: 20 / 2,
    backgroundColor: '#ccc',
    opacity: 1,
    position: 'relative',
    '&::before, &::after': {
      content: '"Não"',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: 12,
      color: '#fff',
    },
    '&::after': {
      content: '"Sim"',
      right: 6,
    },
    '&::before': {
      left: 5,
    },
  },
}));

export default function SwitchWithText() {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <TextSwitch checked={checked} onChange={handleChange} />
  );
}
