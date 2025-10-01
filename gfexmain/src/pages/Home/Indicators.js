import {
  Typography, Card, CardContent,
  Chip, Box, Tooltip, Grid, Skeleton
} from "@mui/material"
import {
  Inventory2, Description, Engineering, PendingActions
} from "@mui/icons-material"

export default function Indicators({ dataIndicator, loading }) {
  const renderChip = (title, value, color) => (
    <Tooltip title={title}>
      {loading ? (
        <Skeleton variant="rectangular" width={50} height={24} sx={{ borderRadius: 4 }} />
      ) : (
        <Chip
          label={`${Math.round(value)}%`}
          size="small"
          variant="outlined"
          sx={{ bgcolor: `${color}.light`, color: "white", borderColor: `${color}.main` }}
        />
      )}
    </Tooltip>
  )

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.975rem', mr: 1 }}>
                Comercialização
              </Typography>
              <Inventory2 sx={{ color: "text.secondary", width: 32, height: 32 }} />
            </Box>

            <Typography variant="h4" sx={{ color: "success.main", mb: 1, fontWeight: 700 }}>
              {loading ? <Skeleton width={60} /> : dataIndicator.comercializacao.recog}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
              <Typography variant="body2" sx={{ color: "error.light" }}>
                {loading ? <Skeleton width={80} /> : `${dataIndicator.comercializacao.notRecog} Reprovados`}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PendingActions sx={{ fontSize: 14, color: "warning.main" }} />
                <Typography variant="body2" sx={{ color: "warning.main", fontWeight: 500 }}>
                  {loading ? <Skeleton width={80} /> : `${dataIndicator.comercializacao.notIdentify} Pendentes`}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              {renderChip(
                "Comercializo",
                (dataIndicator.comercializacao.recog / dataIndicator.comercializacao.total) * 100,
                "success"
              )}
              {renderChip(
                "Não comercializo",
                (dataIndicator.comercializacao.notRecog / dataIndicator.comercializacao.total) * 100,
                "error"
              )}
              {renderChip(
                "Pendente avaliação",
                (dataIndicator.comercializacao.notIdentify / dataIndicator.comercializacao.total) * 100,
                "warning"
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.975rem', mr: 1 }}>
                Informações Técnicas
              </Typography>
              <Engineering sx={{ color: "text.secondary", width: 32, height: 32 }} />
            </Box>

            <Typography variant="h4" sx={{ color: "success.main", mb: 1, fontWeight: 700 }}>
              {loading ? <Skeleton width={60} /> : dataIndicator.informacoesTecnicas.approved}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
              <Typography variant="body2" sx={{ color: "info.main" }}>
                {loading ? <Skeleton width={120} /> : `${dataIndicator.informacoesTecnicas.awaitApproval} Em Análise(Petro)`}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PendingActions sx={{ fontSize: 14, color: "warning.main" }} />
                <Typography variant="body2" sx={{ color: "warning.main", fontWeight: 500 }}>
                  {loading ? <Skeleton width={80} /> : `${dataIndicator.informacoesTecnicas.notIdentify} Pendentes`}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              {renderChip(
                "Aprovado",
                (dataIndicator.informacoesTecnicas.approved / dataIndicator.informacoesTecnicas.total) * 100,
                "success"
              )}
              {renderChip(
                "Em Análise(Petro)",
                (dataIndicator.informacoesTecnicas.awaitApproval / dataIndicator.informacoesTecnicas.total) * 100,
                "info"
              )}
              {renderChip(
                "Pendente avaliação",
                (dataIndicator.informacoesTecnicas.notIdentify / dataIndicator.informacoesTecnicas.total) * 100,
                "warning"
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      
    </Grid>
  )
}