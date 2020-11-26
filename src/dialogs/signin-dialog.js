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
import { Box, debounce, IconButton, InputAdornment, LinearProgress, makeStyles, Tooltip, Typography } from "@material-ui/core";

import {
  Person as NameIcon,
  Lock as PasswordIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
} from '@material-ui/icons';

import { connect } from "react-redux";
import { signinActionCreator } from "../model/actions";
import { bindActionCreators } from "redux";
import { STATES } from "../enums";


const useStyles = makeStyles((theme) => ({
  socialButtons: {
    justifyContent: "center",
    "& svg": {
      fontSize: "3rem",
    }
  },
}));

let waitClose;
function SigninDialog({ open, handleClose, username, isLogged, isError, isLoading, signinRequest }) {

  const { t } = useTranslation(["signin_dialog", "general"]);

  const classes = useStyles();

  const [isEmpty, setEmpty] = useState(false);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (isError) {
      passwordRef.current.value = "";
    }
    if (isLogged) {
      waitClose && waitClose.clear();
      waitClose = debounce(handleClose, 1000);
      waitClose();
    }
    return () => {
      waitClose && waitClose.clear();
    };
  }, [isError, isLogged]);

  const onSubmit = useCallback((event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    if (usernameRef.current && passwordRef.current && usernameRef.current.value && passwordRef.current.value) {
      setEmpty(false);
      signinRequest({ username: usernameRef.current.value, password: passwordRef.current.value });
    } else {
      setEmpty(true);
    }
  }, []);

  const onChange = useCallback(() => {
    if (usernameRef.current && passwordRef.current && usernameRef.current.value && passwordRef.current.value) {
      setEmpty(false);
    }
  }, []);

  return <Dialog open={open} onClose={handleClose}>
    <DialogTitle disableTypography className={"boxes"}>
      <Box>
        <Typography align='center' variant="h6">{t("title")}</Typography>
        {isLoading && <LinearProgress />}
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
        {isLogged && <Alert severity={"success"}>{t("success", { name: username })}</Alert>}
        {isError && <Alert severity={"error"}>{t("error_incorrect")}</Alert>}
        {isEmpty && <Alert severity={"warning"}>{t("error_empty")}</Alert>}

        <TextField disabled={isLogged} error={isEmpty && usernameRef.current && !usernameRef.current.value} required name="username" type="text" autoFocus fullWidth label={t("username_label")} margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start"><NameIcon /></InputAdornment>,
          }} inputRef={usernameRef} onChange={debounce(onChange, 300)} autoComplete="on"/>
          
        <TextField disabled={isLogged} required error={isEmpty && passwordRef.current && !passwordRef.current.value} name="password" type="password" fullWidth label={t("password_label")} margin="normal" InputProps={{
          startAdornment: <InputAdornment position="start"><PasswordIcon /></InputAdornment>,
        }} inputRef={passwordRef} onChange={debounce(onChange, 300)} autoComplete="on"/>

      </DialogContent>
      <DialogActions>
        <Button type="submit" disabled={isLoading || isLogged} onClick={onSubmit} color="primary" variant="contained">{t("general:button_signin")}</Button>
        <Button onClick={handleClose} color="secondary" variant="contained">{t("general:button_close")}</Button>
      </DialogActions>
    </form>
  </Dialog>;
}

const mapStateToProps = (state) => {
  const { user } = state;
  let username = [user.user.name, user.user.surname].filter(a => !!a).join(" ");
  if (!username && user.user.email) {
    username = user.user.email;
  } else if (!username && user.user.phone) {
    username = user.user.phone;
  }
  return {
    username,
    isLogged: user.isLogged,
    isLoading: user.state === STATES.STATE_LOADING,
    isError: user.state === STATES.STATE_ERROR
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  signinRequest: signinActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SigninDialog);