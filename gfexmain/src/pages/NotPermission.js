import React, { useState, useEffect } from 'react';

const TelaErroPermissao = (textTitle, textBody) => {
  

  return (
    <div style={styles.container}>
        <div style={styles.erroContainer}>
          <h1 style={styles.mensagemErro}>Falta de Permissão</h1>
          <p style={styles.descricaoErro}>
            Você não tem permissão para acessar este recurso. Por favor, entre em
            contato com o administrador ou acompanhe a solicitação no 
          </p>
          <a href="https://devcfpb.launchpad.cfapps.br10.hana.ondemand.com/5733c7d4-3ca3-4cfe-b2f8-9e81d2bcbb26.gfexpetrobrasfornmanager.gfexpetrobrasfornmanager-0.0.7/index.html" 
          target="_blank" rel="noopener noreferrer">Wizard Guide GFEX</a>
        </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
  erroContainer: {
    textAlign: 'center',
    backgroundColor: '#f8d7da',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #f5c6cb',
    color: '#721c24',
    maxWidth: '400px',
    width: '100%',
  },
  mensagemErro: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  descricaoErro: {
    fontSize: '16px',
    marginTop: '10px',
  },
};

export default TelaErroPermissao;
