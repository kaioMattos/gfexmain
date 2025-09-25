import { Box, Typography, Link, Paper } from '@mui/material'; 

const TelaErroPermissao = ({ textTitle = "Falta de Permissão", textBody }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
      role="alert"
      aria-live="assertive"
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 420,
          width: '100%',
          textAlign: 'center',
          bgcolor:  '#f8d7da',
          color: (theme) => theme.palette.error.main,
          borderRadius: 2,
          border: (theme) => `2px solid ${theme.palette.error.main}`,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          {textTitle}
        </Typography>
        <Typography variant="body1" mb={2} sx={{ lineHeight: 1.6 }}>
          {textBody ? (
            textBody
          ) : (
            <>
              Você não tem permissão para acessar este recurso. Por favor, entre em contato com o administrador ou acompanhe sua {' '}
              <Link
                href="https://devcfpb.launchpad.cfapps.br10.hana.ondemand.com/5733c7d4-3ca3-4cfe-b2f8-9e81d2bcbb26.gfexpetrobrasfornmanager.gfexpetrobrasfornmanager-0.0.7/index.html"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                color="info.main" 
                fontWeight="medium"
              >
                Solicitação de Acesso GFEX
              </Link>
              .
            </>
          )}
        </Typography>
      </Paper>
    </Box>
  );
};

export default TelaErroPermissao;
