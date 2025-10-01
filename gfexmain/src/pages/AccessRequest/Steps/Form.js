import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Stack, Stepper, styled, Step, StepLabel, Box, StepConnector, stepConnectorClasses } from '@mui/material';
import { Check, Factory } from '@mui/icons-material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ClassIcon from '@mui/icons-material/Class';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { postSupplier, postExclusivityLetter, putSupplier, deleteExclusivityLetter } from "../../../api";
import { useAuth } from '../../../useContext/AuthContext';
import { AccessCtx } from '../../../useContext/AccessCtx';
import CnpjForm from './Cnpj';
import ManufacturerForm from './Manufacturer';
import ClassForm from './Class';
import ExclusivityLetterForm from './ExclusivityLetter';
import CustomDialog from '../../../components/modal/ModalAccess';
import { QontoStepIconRoot, ColorlibStepIconRoot } from './wizardStepCss';
import { base64ToBlob } from '../../../utils'

const wizardStyles = {
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
      //cursor: 'pointer',
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
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 25,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#557C6A',
      width: '100%',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#557C6A',
      width: '100%',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#eaeaf0',
    width: '0%',
    borderTopWidth: 3,
    borderRadius: 1,
    transition: 'border-color 0.7s ease, width 0.7s ease',
    ...theme.applyStyles('dark', {
      borderColor: theme.palette.grey[800],
    }),
  },
}));
const QontoStepIcon = (props) => {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}
QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const getStepContent = (step) => {
  switch (step) {
    case 0:
      return <CnpjForm />;
    case 1:
      return <ManufacturerForm />;
    case 2:
      return <ClassForm />;
    case 3:
      return <ExclusivityLetterForm />;
    default:
      throw new Error('Unknown step');
  }
}

const ColorlibStepIcon = (props) => {
  const { active, completed, className } = props;

  const icons = {
    1: <GroupAddIcon style={{ fontSize: 30 }} />,
    2: <Factory style={{ fontSize: 30 }} />,
    3: <ClassIcon style={{ fontSize: 30 }} />,
    4: <AttachFileIcon style={{ fontSize: 30 }} />
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const steps = ['CNPJ', 'Fabricante', 'Classe', 'Carta de Exclusividade'];



export default function FormWizardSteps() {

  // const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const { user, setActiveForm } = useAuth();
  const { setForm } = AccessCtx();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setForm('edicao')
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const returnOentryLetterFormData = (item) => {
    const formData = new FormData();
    formData.append('documentId', user.infoS4H.documentId);
    formData.append('manufacturerName', item.manufacturerName);
    const blob = base64ToBlob(item.localFile, item.mediaType);
    const file = new File([blob], item.fileName, { type: item.mediaType });
    formData.append('file', file);
    return formData
  }
  const returnOentryLetter = (item) => ( {
      id: item.id,
      manufacturerName: item.manufacturerName,
      localFile: item.localFile,
      fileName: item.fileName,
      extension: item.extension,
      mediaType: item.mediaType,
      expiredDate: new Date(item.expiredDateTime),
      createdAt: new Date(),
      updatedAt: new Date(),
      documentId: user.infoS4H.documentId
    })
  const handleNext = async () => {
    if ((activeStep + 1) < 4)
      return setActiveStep(activeStep + 1);
    try {
      const oEntrySupplier = {
        lifnr: user.lifnr,
        eMail: user.email,
        documentId: user.infoS4H.documentId,
        cnpj: JSON.stringify(user.infoS4H.cnpj),
        manufacturer: JSON.stringify(user.infoS4H.manufacturer),
        class: JSON.stringify(user.infoS4H.class),
        validatedPetro: 'aguardando avaliacao',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const oEntryDocuments = user.infoS4H.exclusivityLetter
        .filter((item) => (item.status && item.newDocument))
        .map(returnOentryLetterFormData)
      const oEntryDocumentsDelete = user.infoS4H.exclusivityLetter
        .filter((item) => (!item.status && !item.newDocument))
        .map(returnOentryLetter)

      console.log(oEntrySupplier)
      let aPromiseSupplier = []
      if (user.infoS4H.validatedPetro === 'aguardando avaliacao') {
        aPromiseSupplier = putSupplier(oEntrySupplier);
        oEntryDocumentsDelete.map((oEntry) => (deleteExclusivityLetter(oEntry)))
      } else {
        aPromiseSupplier = postSupplier(oEntrySupplier);
      }
      const aPromiseExclusivityLetter = oEntryDocuments.map((oEntry) => (postExclusivityLetter(oEntry)))
      await Promise.all([aPromiseSupplier, ...aPromiseExclusivityLetter]);
      handleClickOpen();
      // handleEdit();
    } finally {
      // setLoading(false);
    }
  };
 
  return (
    <Box >
      <Stack sx={{
        width: '100%', border: '2px solid rgb(36, 142, 92)', mx: 'auto',
        paddingTop: '16px', paddingBottom: '16px', borderRadius: '10px'
      }} spacing={4}>
        <Stepper sx={{
          justifyContent: 'center',
          '& .MuiStep-root': {
            flex: '1 0 auto',
            maxWidth: '500px',
            justifyContent: 'center'
          },
        }} alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
          {steps.map((label, index) => (
            <Step key={label} className={wizardStyles.step} sx={{
              '&:hover': {
                //cursor: 'pointer',
              },
              width: '10%',
              flex: 'initial',
            }}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>
      <React.Fragment>
        <CustomDialog handleClose={() => handleClose()} open={open} />
        <React.Fragment>
          <Box className={wizardStyles.form} sx={{
            margin: 'auto',
            padding: 2.5,
            minHeight: '350px',
          }}>
            {getStepContent(activeStep)}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, mb: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1, backgroundColor: 'rgb(40,140,100)', color: '#fff', borderRadius: '6px', '&:hover': { backgroundColor: 'rgb(0,98,152)' } }}>
                Anterior
              </Button>
            )}
            <Button
              disabled={user.infoS4H.activeNextDisabled}
              variant="contained"
              onClick={handleNext}
              sx={{ backgroundColor: 'rgb(40,140,100)', color: '#fff', borderRadius: '6px', '&:hover': { backgroundColor: 'rgb(0,98,152)' } }}
            >
              {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
            </Button>
          </Box>
        </React.Fragment>
      </React.Fragment>
    </Box>
  );
}