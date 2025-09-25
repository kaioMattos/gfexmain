import React, { useEffect } from 'react';

import { Box } from '@mui/material';
import { useAuth } from '../../useContext/AuthContext';
import FormWizardSteps from './Steps/Form';
import FormReview from './Review/Form'
import { wizardStyles } from './Steps/wizardStepCss';
import { AccessCtx } from '../../useContext/AccessCtx';
import Header from '../../components/Header'

const AccessRequest = () => {
  const { user } = useAuth();
  const { form, setForm } = AccessCtx();
  const loadFormAcess = () => {
    let form = 'cadastro'
    if (user.infoS4H.hasOwnProperty('validatedPetro') && user.infoS4H.validatedPetro === 'aguardando avaliacao') form = 'edicao'
    setForm(form)
  }
  useEffect(() => {
    loadFormAcess();
  }, []);
  return (
    <>
    <Header typeHeader={'AccessReq'} />
      
      <div style={{ width: '80%', margin: 'auto', marginTop: '3rem' }}>
        <Box sx={{ margin: 'auto' }}>
          <Box className={wizardStyles.paper}>
            {!user.isRegistered || form === 'cadastro' ? <FormWizardSteps /> : <FormReview />}
          </Box>
        </Box>
      </div>

    </>
  );
};

export default AccessRequest;
