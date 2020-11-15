import React, { useMemo, useRef, useState } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTranslation } from "react-i18next";
import { Box, ButtonGroup, IconButton, InputAdornment, makeStyles, Typography } from "@material-ui/core";

import {
  Face as NameIcon,
  Lock as PasswordIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  headerBox: {
    marginTop: '-40px',
    backgroundColor: theme.palette.info.main,
    height: '50px',
    borderRadius: theme.shape.borderRadius
  },
  headerBoxTitle: {
    paddingTop: theme.spacing(1),
    color: theme.palette.info.contrastText
  },
  socialButtons: {
    justifyContent: "center",

    "& svg": {
      fontSize: "3rem",
    }
  }
}));

function LoginDialog({ open, handleClose }) {

  const { t } = useTranslation(["login-dialog", "general"]);

  const classes = useStyles();

  return <Dialog open={open} onClose={handleClose}>
    <DialogTitle disableTypography>
      <Box className={classes.headerBox} >
        <Typography align='center' variant="h6" className={classes.headerBoxTitle} >{t("title")}</Typography>
      </Box>
    </DialogTitle>
    <DialogActions className={classes.socialButtons}>
      <IconButton><InstagramIcon /></IconButton>
      <IconButton><FacebookIcon /></IconButton>
    </DialogActions>
    <DialogContent>
      <DialogContentText align='center' >{t("description")}</DialogContentText>
      <form className={classes.form}>
        <TextField required name="user" autoFocus fullWidth label={t("user-label")} margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start"><NameIcon /></InputAdornment>,
          }} />
        <TextField required name="password" type="password" fullWidth label={t("password-label")} margin="normal" InputProps={{
          startAdornment: <InputAdornment position="start"><PasswordIcon /></InputAdornment>,
        }} />
      </form>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary" variant="contained">{t("general:button-sign-in")}</Button>
      <Button onClick={handleClose} color="secondary" variant="contained">{t("general:button-close")}</Button>
    </DialogActions>
  </Dialog>;
}

export default LoginDialog;