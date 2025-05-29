import React from "react";
import { makeStyles } from "@mui/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    marginLeft: theme.spacing(2)
  }
}));

export default function AppMainBar() {
  const classes = useStyles();

  return (
    <AppBar position="static">
     
    </AppBar>
  );
}
