import React, { useState, useEffect } from 'react';
import {
  Alert, List, ListSubheader, Grid, Typography, Button,
  Stack, Stepper, StepButton, Step, Box
} from '@mui/material';

import PropTypes from 'prop-types';
import EachItem from "../../../components/list/EachItem";
import { useAuth } from '../../../useContext/AuthContext';
import { PiFactory } from "react-icons/pi";
import CustomList from '../../../components/list/Index'
import { MdOutlineClass } from "react-icons/md";
import { PiUserCircleFill } from "react-icons/pi";
import DocumentLetterTable from '../../../components/Table/ReviewDocs'
import { GroupAdd, Factory, Class, AttachFile } from '@mui/icons-material';
import { ColorlibStepIconRoot } from '../Steps/wizardStepCss';
import { AccessCtx } from '../../../useContext/AccessCtx';
const ColorlibStepIcon = ({ active, completed, icon }) => {
  const icons = {
    1: <GroupAdd style={{ fontSize: 30 }} />,
    2: <Factory style={{ fontSize: 30 }} />,
    3: <Class style={{ fontSize: 30 }} />,
    4: <AttachFile style={{ fontSize: 30 }} />,
  };
  return <ColorlibStepIconRoot ownerState={{ active, completed }}>{icons[icon]}</ColorlibStepIconRoot>;
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2.5}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function FormReview() {
  const [activeStep, setActiveStep] = useState(0);
  const [manufacturerNameMap, setManufacturerNameMap] = useState({});
  const [groupedClasses, setGroupedClasses] = useState([]);
  const { user } = useAuth();
  const { setForm } = AccessCtx();

  const handleEdit = () => {
    setForm('cadastro')
  }

  // Monta o mapa de manufacturerNumber -> nome legível
  useEffect(() => {
    const map = user.infoS4H.manufacturer.reduce((acc, mfg) => {
      acc[mfg.ManufacturerNumber] = mfg.text;
      return acc;
    }, {});
    setManufacturerNameMap(map);
  }, [user.infoS4H.manufacturer]);

  // Agrupa as classes por fabricante
  useEffect(() => {
    if (!user.infoS4H.manufacturer || !user.infoS4H.class) return;

    // Pega todos os ManufacturerNumber selecionados
    const validMfgNumbers = user.infoS4H.manufacturer.map(m => m.ManufacturerNumber);

    // Filtra as classes para considerar apenas os fabricantes válidos
    const filteredClasses = user.infoS4H.class.filter(cls =>
      validMfgNumbers.includes(cls.ManufacturerNumber) && cls.status === true
    );
    const grouped = filteredClasses.reduce((acc, cls) => {
      const mfgNum = cls.ManufacturerNumber;
      if (!acc[mfgNum]) acc[mfgNum] = [];
      acc[mfgNum].push(cls);
      return acc;
    }, {});

    const listForCustomList = Object.keys(grouped).map(mfgNum => ({
      manufacturerName: manufacturerNameMap[mfgNum] || mfgNum,
      classes: grouped[mfgNum]
    }));

    setGroupedClasses(listForCustomList);
  }, [user.infoS4H.class, user.infoS4H.manufacturer, manufacturerNameMap]);
  console.log("asdasKAIO", user.infoS4H.exclusivityLetter)
  return (
    <>
      <div >
        <Stack sx={{ width: '100%', border: '2px solid rgb(36, 142, 92)', borderRadius: '10px', py: 2 }} spacing={2}>
          <Stepper alternativeLabel activeStep={activeStep} connector={null}>
            {['CNPJ', 'Fabricante', 'Classe', 'Carta de Exclusividade'].map((label, index) => (
              <Step key={label} completed={false}>
                <StepButton
                  onClick={() => setActiveStep(index)}
                  icon={<ColorlibStepIcon icon={index + 1} active={activeStep === index} />}
                  disabled={false}
                >
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Stack>
        <Box style={{ minHeight: '280px' }}>
          <TabPanel value={activeStep} index={0}>
            <Grid container >
              <Grid item xs={12} sx={{ textAlign: 'left' }} container>
                <Alert severity="info">
                  CNPJs comerciais:
                </Alert>
              </Grid>
            </Grid>

            <Grid item xs={12} >
              <CustomList
                aValues={user.infoS4H.cnpj}
                haveIconAction={false}
                activeItems={true}
                toDoDeleteHandler=""
                icon={<PiUserCircleFill style={{ fontSize: 23 }}
                  propKey="id" />}
              />

            </Grid>
          </TabPanel>
          <TabPanel value={activeStep} index={1}>
            <Grid container >
              <Grid item xs={12} sx={{ textAlign: 'left' }} container>
                <Alert severity="info">
                  Para os CNPJs comerciais, foram encontrados os seguintes fabricantes:
                </Alert>
              </Grid>
            </Grid>

            <Grid item xs={12} >
              <CustomList
                aValues={user.infoS4H.manufacturer}
                haveIconAction={false}
                activeItems={true}
                toDoDeleteHandler=""
                icon={<PiFactory style={{ fontSize: 23 }}
                  propKey="text" />}
              />

            </Grid>
          </TabPanel>
          <TabPanel value={activeStep} index={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ textAlign: 'left' }}>
                <Alert severity="info">
                  Para os Fabricantes comercializados, foram encontradas as seguintes classes:
                </Alert>
              </Grid>

              <List
                style={{
                  width: '100%',
                  position: 'relative',
                  overflow: 'auto',
                  maxHeight: 250,
                }}
              >
                {groupedClasses.map((group) => (
                  <React.Fragment key={group.manufacturerName}>
                    <ListSubheader
                      style={{
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        textAlign: 'left',
                        color: 'rgb(40, 140, 100)',
                        borderRadius: '6px',
                      }}
                      disableSticky
                    >
                      {group.manufacturerName}
                    </ListSubheader>

                    {group.classes.map((_class) => (
                      <EachItem
                        key={_class.id}
                        oItem={_class}
                        icon={<MdOutlineClass style={{ fontSize: 23 }} />}
                        showManufacturerNumber={false}
                        toDoDeleteHandler=""
                        iconButtonHandler=""
                      />
                    ))}
                  </React.Fragment>
                ))}
              </List>


            </Grid>
          </TabPanel>
          <TabPanel value={activeStep} index={3}>
            <DocumentLetterTable
              aValues={user.infoS4H.exclusivityLetter}
              justView={true}
              setExpiredDate={() => { }}
              setExclusivityLetter={() => { }}
            />
          </TabPanel>
        </Box>
      </div>
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
      }} >
        <Button
          onClick={handleEdit} sx={{
            backgroundColor: 'rgb(40, 140, 100)',
            color: '#fff',
            mt: 3,
            ml: 1,
            borderRadius: '6px',
            '&:hover': {
              backgroundColor: 'rgb(0, 98, 152)',

            },
          }} >
          Editar
        </Button>
      </Box>
    </>
  );
}
