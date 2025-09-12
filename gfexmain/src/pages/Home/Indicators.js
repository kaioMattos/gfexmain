import {
  Typography, Card, CardContent,
  Chip, Box, Tooltip,
  Grid,
  MenuItem as MenuItemComponent
} from "@mui/material"
import {
  Inventory2, Description, AttachMoney, Menu as MenuIcon,
  Engineering, PendingActions
} from "@mui/icons-material";

export default function Indicators({ dataIndicator }) {

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body2" color="text.secondary" 
                sx={{ fontWeight: 500, fontSize:'0.975rem', mr:1 }}>
                Comercialização
              </Typography>
              <Inventory2 sx={{ color: "text.secondary", width: 32, height: 32 }} />
            </Box>
            <Typography variant="h4" sx={{ color: "success.main", mb: 1, fontWeight: 700 }}>
              {dataIndicator.comercializacao.recog}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
              <Typography variant="body2" sx={{ color: "error.light"}}>
                {dataIndicator.comercializacao.notRecog} Reprovados
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PendingActions sx={{ fontSize: 14, color: "warning.main" }} />
                <Typography variant="body2" sx={{ color: "warning.main", fontWeight: 500 }}>
                  {dataIndicator.comercializacao.notIdentify} Pendentes
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Comercializo">
                <Chip
                  label={`${Math.round((dataIndicator.comercializacao.recog / dataIndicator.comercializacao.total) * 100)}%`}
                  size="small"
                  variant="outlined"
                  sx={{ bgcolor: "success.light", color: "white", borderColor: "success.main" }}
                />
              </Tooltip>
              {/* {dataIndicator.comercializacao.notRecog > 0 && ( */}
              <Tooltip title="Não comercializo">
                <Chip
                  label={`${Math.round((dataIndicator.comercializacao.notRecog / dataIndicator.comercializacao.total) * 100)}%`}
                  size="small"
                  variant="outlined"
                  sx={{ bgcolor: "error.light", color: "white", borderColor: "error.main" }}
                />
              </Tooltip>
              {/* // )} */}
              {/* // {dataIndicator.comercializacao.notIdentify > 0 && ( */}
              <Tooltip title="Pendente avaliação">
                <Chip
                  label={`${Math.round((dataIndicator.comercializacao.notIdentify / dataIndicator.comercializacao.total) * 100)}%`}
                  size="small"
                  variant="outlined"
                  sx={{ bgcolor: "warning.light", color: "white", borderColor: "warning.main" }}
                />
              </Tooltip>
              {/* // )} */}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize:'0.975rem', mr:1 }}>
                Informações Técnicas
              </Typography>
              <Engineering sx={{ color: "text.secondary", width: 32, height: 32 }} />
            </Box>
            <Typography variant="h4" sx={{ color: "success.main", mb: 1, fontWeight: 700 }}>
              {dataIndicator.informacoesTecnicas.approved}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
              <Typography variant="body2" sx={{ color: "info.main"}}>
                {dataIndicator.informacoesTecnicas.awaitApproval} Em Análise(Petro)
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PendingActions sx={{ fontSize: 14, color: "warning.main" }} />
                <Typography variant="body2" sx={{ color: "warning.main", fontWeight: 500 }}>
                  {dataIndicator.informacoesTecnicas.notIdentify} Pendentes
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Aprovado">
              <Chip
                label={`${Math.round((dataIndicator.informacoesTecnicas.approved / dataIndicator.informacoesTecnicas.total) * 100)}%`}
                size="small"
                variant="outlined"
                sx={{ bgcolor: "success.light", color: "white", borderColor: "success.main" }}
              />
              </Tooltip>
              {/* {dataIndicator.informacoesTecnicas.awaitApproval > 0 && ( */}
              <Tooltip title="Em Análise(Petro)">

              <Chip
                label={`${Math.round((dataIndicator.informacoesTecnicas.awaitApproval / dataIndicator.informacoesTecnicas.total) * 100)}%`}
                size="small"
                variant="outlined"
                sx={{ bgcolor: "info.light", color: "white", borderColor: "info.main" }}
              />
              </Tooltip>
              {/* )} */}
              {/* {dataIndicator.informacoesTecnicas.notIdentify > 0 && ( */}
              <Tooltip title="Pendente avaliação">

              <Chip
                label={`${Math.round((dataIndicator.informacoesTecnicas.notIdentify / dataIndicator.informacoesTecnicas.total) * 100)}%`}
                size="small"
                variant="outlined"
                sx={{ bgcolor: "warning.light", color: "white", borderColor: "warning.main" }}
              />
              </Tooltip>
              {/* )} */}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize:'0.975rem' }}>
                Minuta Contratual
              </Typography>
              <Description sx={{ color: "text.secondary", width: 32, height: 32}} />
            </Box>
            <Typography variant="h4" sx={{ color: "success.main", mb: 1, fontWeight: 700 }}>
              {dataIndicator.minutaContratual.agree}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
              <Typography variant="body2" sx={{ color: "error.light"}}>
                {dataIndicator.minutaContratual.notAgree} Não Concordante
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PendingActions sx={{ fontSize: 14, color: "warning.main" }} />
                <Typography variant="body2" sx={{ color: "warning.main", fontWeight: 500 }}>
                  {dataIndicator.minutaContratual.notIdentify} Pendentes
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Concordante ">
              <Chip
                label={`${Math.round((dataIndicator.minutaContratual.agree / dataIndicator.minutaContratual.total) * 100)}%`}
                size="small"
                variant="outlined"
                sx={{ bgcolor: "success.light", color: "white", borderColor: "success.main" }}
              />
              </Tooltip>
              {/* {dataIndicator.minutaContratual.notAgree > 0 && ( */}
              <Tooltip title="Não Concordante">
              <Chip
                label={`${Math.round((dataIndicator.minutaContratual.notAgree / dataIndicator.minutaContratual.total) * 100)}%`}
                size="small"
                variant="outlined"
                sx={{ bgcolor: "error.light", color: "white", borderColor: "error.main" }}
              />
              </Tooltip>
              {/* // )} */}
              {/* // {dataIndicator.minutaContratual.notIdentify > 0 && ( */}
              <Tooltip title="Pendente avalidação">
              <Chip
                label={`${Math.round((dataIndicator.minutaContratual.notIdentify / dataIndicator.minutaContratual.total) * 100)}%`}
                size="small"
                variant="outlined"
                sx={{ bgcolor: "warning.light", color: "white", borderColor: "warning.main" }}
              />
                            </Tooltip>

              {/* )} */}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
    </Grid>
  );
}