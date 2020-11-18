import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';
import { useTranslation } from "react-i18next";
import { Box, IconButton, InputAdornment, LinearProgress, makeStyles, Typography } from "@material-ui/core";
import { cancelable } from 'cancelable-promise';

import {
  Face as NameIcon,
  Lock as PasswordIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
} from '@material-ui/icons';
import { signin } from "../api";

let waitPromise;
const useStyles = makeStyles((theme) => ({
  headerBox: {
    marginTop: '-40px',
    backgroundColor: theme.palette.info.main,
    background: `linear-gradient(90deg, ${theme.palette.info.main} 0, ${theme.palette.info[theme.palette.type]} 100%)`,
    borderRadius: theme.shape.borderRadius
  },
  headerBoxTitle: {
    paddingTop: theme.spacing(1),
    height: '50px',
    color: theme.palette.info.contrastText
  },
  socialButtons: {
    justifyContent: "center",
    "& svg": {
      fontSize: "3rem",
    }
  },
}));

function LoginDialog({ open, handleClose }) {

  const { t } = useTranslation(["login-dialog", "general"]);

  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    return () => {
      waitPromise && waitPromise.cancel();
    };
  }, []);

  const onSubmit = useCallback((event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    if (usernameRef.current && passwordRef.current) {
      waitPromise && waitPromise.cancel();
      setLoading(true);
      waitPromise = cancelable(signin({ username: usernameRef.current.value, password: passwordRef.current.value }))
        .then(({ success }) => {
          setLoading(false);
          if (success) {
            handleClose();
          } else {
            setError(true);
            passwordRef.current.value = "";
          }
        });
    } else {
      setError(true);
    }

  }, []);

  return <Dialog open={open}>
    <DialogTitle disableTypography>
      <Box className={classes.headerBox} >
        <Typography align='center' variant="h6" className={classes.headerBoxTitle} >{t("title")}</Typography>
        {loading && <LinearProgress className={classes.indicator} />}
      </Box>
    </DialogTitle>
    <DialogActions className={classes.socialButtons}>
      <IconButton><InstagramIcon /></IconButton>
      <IconButton><FacebookIcon /></IconButton>
    </DialogActions>
    <form className={classes.form} onSubmit={onSubmit} autoComplete="on">
      <DialogContent>
        <DialogContentText align='center' >{t("description")}</DialogContentText>
        {error && <Alert severity="error">{t("error")}</Alert>}

        <TextField required name="username" type="text" autoFocus fullWidth label={t("user-label")} margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start"><NameIcon /></InputAdornment>,
          }} inputRef={usernameRef} />
        <TextField required name="password" type="password" fullWidth label={t("password-label")} margin="normal" InputProps={{
          startAdornment: <InputAdornment position="start"><PasswordIcon /></InputAdornment>,
        }} inputRef={passwordRef} />

      </DialogContent>
      <DialogActions>
        <Button type="submit" disabled={loading} onClick={onSubmit} color="primary" variant="contained">{t("general:button-sign-in")}</Button>
        <Button disabled={loading} onClick={handleClose} color="secondary" variant="contained">{t("general:button-close")}</Button>
      </DialogActions>
    </form>
  </Dialog>;
}

export default LoginDialog;