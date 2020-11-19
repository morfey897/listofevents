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
import { Box, IconButton, InputAdornment, LinearProgress, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { cancelable } from 'cancelable-promise';
import { debounce } from 'debounce';

import {
  Person as NameIcon,
  Lock as PasswordIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
} from '@material-ui/icons';
import { signin } from "../api";


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

let waitPromise;
let waitClose;
function ProfileDialog({ open, handleClose }) {

  const { t } = useTranslation(["profile_dialog", "general"]);

  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ state: "", message: "" });

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    return () => {
      waitPromise && waitPromise.cancel();
      waitClose && waitClose.clear();
    };
  }, []);

  const onSubmit = useCallback((event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    if (usernameRef.current && passwordRef.current) {
      waitPromise && waitPromise.cancel();
      waitClose && waitClose.clear();
      setLoading(true);
      waitPromise = cancelable(signin({ username: usernameRef.current.value, password: passwordRef.current.value }))
        .then(({ success, user }) => {
          setLoading(false);
          if (success) {
            setResult({ state: "success", message: t("success", { name: [user.name, user.surname].filter(a => !!a).join(" ") }) });
            waitClose = debounce(handleClose, 1500);
            waitClose();
          } else {
            setResult({ state: "error", message: t("error_incorrect") });
            passwordRef.current.value = "";
          }
        });
    } else {
      setResult({ state: "error", message: t("error_empty") });
    }

  }, []);

  return <Dialog open={open} onClose={handleClose}>
    <DialogTitle disableTypography>
      <Box className={classes.headerBox} >
        <Typography align='center' variant="h6" className={classes.headerBoxTitle} >{t("title")}</Typography>
        {loading && <LinearProgress className={classes.indicator} />}
      </Box>
    </DialogTitle>
    <DialogActions className={classes.socialButtons}>
      <Tooltip title={t("instagram_enter")}>
        <IconButton><InstagramIcon style={{ color: "#FF8948" }} /></IconButton>
      </Tooltip>
      <Tooltip title={t("facebook_enter")}>
        <IconButton><FacebookIcon style={{ color: "#485993" }} /></IconButton>
      </Tooltip>

    </DialogActions>
    <form className={classes.form} onSubmit={onSubmit} autoComplete="on">
      <DialogContent>
        <DialogContentText align='center' >{t("description")}</DialogContentText>
        {!!result.state && <Alert severity={result.state}>{result.message}</Alert>}

        <TextField disabled={result.state === "success"} required name="username" type="text" autoFocus fullWidth label={t("use_label")} margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start"><NameIcon /></InputAdornment>,
          }} inputRef={usernameRef} />
        <TextField disabled={result.state === "success"}required name="password" type="password" fullWidth label={t("password_label")} margin="normal" InputProps={{
          startAdornment: <InputAdornment position="start"><PasswordIcon /></InputAdornment>,
        }} inputRef={passwordRef} />

      </DialogContent>
      <DialogActions>
        <Button type="submit" disabled={loading || result.state === "success"} onClick={onSubmit} color="primary" variant="contained">{t("general:button_signin")}</Button>
        <Button disabled={loading || result.state === "success"} onClick={handleClose} color="secondary" variant="contained">{t("general:button_close")}</Button>
      </DialogActions>
    </form>
  </Dialog>;
}

export default ProfileDialog;