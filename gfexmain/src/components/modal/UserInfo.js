import React from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Avatar,
  Divider,
  Grid,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,           // mais estreita
  maxHeight: "70vh",    // menos altura
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 12,
  p: 3,                 // padding menor
  overflowY: "auto",
  outline: "none",
};

function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: "secondary.main",
      width: 48,       // avatar menor
      height: 48,
      fontSize: 24,
      fontWeight: "bold",
    },
    children: `${name.split(" ")[0][0].toUpperCase()}`,
  };
}
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function getFirstAndSecondName(email) {
  if (!email) return "";

  const localPart = email.split("@")[0];
  const parts = localPart.split(".");

  const firstName = parts[0] ? capitalize(parts[0]) : "";
  const secondName = parts[1] ? capitalize(parts[1]) : "";

  return `${firstName} ${secondName}`.trim();
}
export default function UserInfoModal({ open, handleClose, data }) {
  // const user = {
  //   name: "João Silva",
  //   email: "joao.silva@email.com",
  //   groups: ["Finance", "HR", "IT Support"],
  //   roles: ["Admin", "Editor", "User"],
  // };
  const formatKey = (key) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-user-info">
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar {...stringAvatar(data.email)} />
            <Typography variant="h6" fontWeight="600" noWrap>
              {getFirstAndSecondName(data.email)}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" aria-label="close">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={1}>
          {Object.entries(data).map(([key, value]) => {
            if (key !== "email") return null;

            return (
              <Grid item xs={6} key={key}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                  {formatKey(key)}
                </Typography>
                <Typography variant="body2" noWrap>
                  {value}
                </Typography>
              </Grid>
            );
          })}
        </Grid>

        {data.attributes['xs.saml.groups']?.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Grupos
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {data.attributes['xs.saml.groups'].map((group) => (
                <Chip key={group} label={group} size="small" color="primary" variant="outlined" />
              ))}
            </Stack>
          </>
        )}

        {data.attributes['xs.rolecollections']?.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Roles
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {data.attributes['xs.rolecollections'].map((role) => (
                <Chip key={role} label={role} size="small" color="secondary" variant="outlined" />
              ))}
            </Stack>
          </>
        )}

        <Box mt={3} textAlign="right">
          <Button size="small" variant="outlined" onClick={handleClose}>
            Fechar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
