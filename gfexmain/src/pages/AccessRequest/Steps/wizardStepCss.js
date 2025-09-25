import { styled } from '@mui/material/styles';

export const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 55,
  height: 55,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[700],
  }),
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient(270deg, rgb(157, 207, 59) 0%, rgb(0, 133, 66) 100%)',
    boxShadow: '0 4px 10px 0 rgba(5, 19, 36, 0.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage: 'linear-gradient(270deg, rgb(157, 207, 59) 0%, rgb(0, 133, 66) 100%)',
  }),
}));

// Ícone customizado do passo (Qonto)
export const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[700],
  }),
  ...(ownerState.active && {
    color: '#784af4',
  }),
}));

// Input visualmente escondido
export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
export const wizardStyles = {
  root: {
    flexGrow: 1,
    border: '1px solid #ccc5c5',
  },
  form: {
    margin: 'auto',
    padding: 2.5,
    minHeight: '350px',
  },
  step: {
    '&:hover': {
      cursor: 'pointer',
    },
    width: '10%',
    flex: 'initial',
  },
  stepper: {
    py: 3,
    pb: 5,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
   backgroundColor: 'rgb(40, 140, 100)',
    color: '#fff',
    mt: 3,
    ml: 1,
   borderRadius: '6px',
    '&:hover': {
      backgroundColor: 'rgb(0, 98, 152)',

    },
  },
  buttonAdd: {
   backgroundColor: 'rgb(138,35,135)',
    background: 'rgb(135, 88, 255)',
    color: 'rgb(255, 255, 255)',
    border: 'none',
    cursor: 'pointer',
  },
  list: {
    ml: 2,
    mr: 2,
  },
  table: {
    mt: 5,
    mr: 2,
  },
};