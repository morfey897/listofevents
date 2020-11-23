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
import { cancelable } from "cancelable-promise";

import {
  Label as LabelIcon,
  Person as NameIcon,
  LockOutlined as ConfirmPasswordIcon,
  Lock as PasswordIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
} from '@material-ui/icons';

import { connect } from "react-redux";
import { signupActionCreator } from "../model/actions";
import { bindActionCreators } from "redux";
import { ERRORCODES, STATES } from "../enums";
import { outhcode } from "../api";


const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    marginTop: '-40px',
    backgroundColor: theme.palette.info.main,
    background: `linear-gradient(90deg, ${theme.palette.info.main} 0, ${theme.palette.info[theme.palette.type]} 100%)`,
    borderRadius: theme.shape.borderRadius,
    "& > .MuiTypography-root": {
      paddingTop: theme.spacing(1),
      height: '50px',
      color: theme.palette.info.contrastText
    }
  },
  socialButtons: {
    justifyContent: "center",
    "& svg": {
      fontSize: "3rem",
    }
  },
}));

let waitClose;
let timerUID = 0;
let waitCodePromise;

function SignupDialog({ open, handleClose, username, isLogged, isError, isLoading, errorCode, signupRequest }) {

  const { t } = useTranslation(["signin_dialog", "general"]);

  const classes = useStyles();

  const [lostTime, setLostTime] = useState(0);
  const [authcode, setAuthCode] = useState({ state: STATES.STATE_NONE });
  const [localErrorCode, setLocalErrorCode] = useState(errorCode);

  const nameRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const validateCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      waitCodePromise && waitCodePromise.cancel();
    };
  }, []);

  useEffect(() => {
    clearInterval(timerUID);
    if (authcode.state === STATES.STATE_READY) {
      timerUID = setInterval(() => {
        setLostTime((lostTime) => {
          if (lostTime > authcode.lifetime) {
            clearInterval(timerUID);
          }
          return Math.min(lostTime + 1, authcode.lifetime);
        });
      },
        1000);
    }
    return () => {
      clearInterval(timerUID);
    };
  }, [authcode]);

  useEffect(() => {
    if (isError && errorCode !== ERRORCODES.ERROR_INCORRECT_CODE) {
      passwordRef.current.value = "";
      confirmPasswordRef.current.value = "";
    }
    if (isLogged) {
      waitClose && waitClose.clear();
      waitClose = debounce(handleClose, 1000);
      waitClose();
    }
    return () => {
      waitClose && waitClose.clear();
    };
  }, [isError, errorCode, isLogged]);

  const onSubmit = useCallback((event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }

    if (usernameRef.current && passwordRef.current && passwordRef.current.value && usernameRef.current.value) {
      if (passwordRef.current.value !== (confirmPasswordRef.current && confirmPasswordRef.current.value || "")) {
        setLocalErrorCode(ERRORCODES.ERROR_INCORRECT_PASSWORD);
      } else {
        if (authcode.state === STATES.STATE_NONE) {
          setAuthCode({ state: STATES.STATE_LOADING });
          waitCodePromise = cancelable(outhcode({ username: usernameRef.current.value }))
            .then(({ success, errorCode, data }) => {
              if (success !== true) {
                setAuthCode({ state: STATES.STATE_ERROR });
                setLocalErrorCode(errorCode);
              } else {
                setAuthCode({ state: STATES.STATE_READY, ...data });
                setLocalErrorCode(0);
              }
            })
            .catch(() => {
              setAuthCode({ state: STATES.STATE_ERROR });
              setLocalErrorCode(ERRORCODES.ERROR_WRONG);
            });
        } else {
          setLocalErrorCode(0);
          signupRequest({
            name: nameRef.current && nameRef.current.value || "",
            username: usernameRef.current.value || "",
            code: validateCodeRef.current && validateCodeRef.current.value || 0,
            password: passwordRef.current.value
          });
        }
      }
    } else {
      setLocalErrorCode(ERRORCODES.ERROR_EMPTY);
    }
  }, [authcode]);

  const onChange = useCallback(() => {
    if (usernameRef.current && passwordRef.current && usernameRef.current.value && passwordRef.current.value) {
      setAuthCode({ state: STATES.STATE_NONE });
      setLocalErrorCode(0);
    }
  }, []);

  const onChangeCode = useCallback(() => {
    if (authcode.state === STATES.STATE_READY && validateCodeRef.current && validateCodeRef.current.value.length === authcode.codeLen) {
      onSubmit();
    }
  }, [authcode]);

  return <Dialog open={open} onClose={handleClose}>
    <DialogTitle disableTypography>
      <Box className={classes.dialogTitle} >
        <Typography align='center' variant="h6">{t("title_signup")}</Typography>
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
    <form className={classes.form} onSubmit={onSubmit}>
      <DialogContent>
        <DialogContentText align='center'>{t("description")}</DialogContentText>
        {isLogged && <Alert severity={"success"}>{t("success", { name: username })}</Alert>}
        {
          !isLogged && (authcode.state === STATES.STATE_READY || (authcode.state === STATES.STATE_ERROR && errorCode === ERRORCODES.ERROR_INCORRECT_CODE)) &&
          <Alert severity={"success"}>{t(`wait_validate_code_${authcode.type}`, { username: authcode.username })}</Alert>
        }
        {localErrorCode === ERRORCODES.ERROR_EMPTY && <Alert severity={"warning"}>{t("error_empty")}</Alert>}
        {localErrorCode === ERRORCODES.ERROR_INCORRECT_PASSWORD && <Alert severity={"warning"}>{t("error_incorrect_password")}</Alert>}
        {localErrorCode === ERRORCODES.ERROR_EXIST && <Alert severity={"error"}>{t("error_user_esist")}</Alert>}
        {localErrorCode === ERRORCODES.ERROR_INCORRECT_USERNAME && <Alert severity={"error"}>{t("error_incorrect_username")}</Alert>}
        {localErrorCode === ERRORCODES.ERROR_WRONG && <Alert severity={"warning"}>{t("error_wrong")}</Alert>}

        <TextField disabled={isLogged || isLoading} name="name" type="text" autoFocus fullWidth label={t("name_label")} margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start"><NameIcon /></InputAdornment>,
          }} inputRef={nameRef} />

        <TextField disabled={isLogged || isLoading} error={(localErrorCode === ERRORCODES.ERROR_EMPTY && (!usernameRef.current || !usernameRef.current.value)) || localErrorCode === ERRORCODES.ERROR_INCORRECT_USERNAME} required name="username" type="text" fullWidth label={t("username_label")} margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start"><LabelIcon /></InputAdornment>,
          }} inputRef={usernameRef} onChange={debounce(onChange, 300)} autoComplete="on" />

        <TextField disabled={isLogged || isLoading} error={localErrorCode === ERRORCODES.ERROR_EMPTY && (!passwordRef.current || !passwordRef.current.value)} required name="password" type="password" fullWidth label={t("password_label")} margin="normal" InputProps={{
          startAdornment: <InputAdornment position="start"><PasswordIcon /></InputAdornment>,
        }} inputRef={passwordRef} onChange={debounce(onChange, 300)} autoComplete="on" />

        <TextField disabled={isLogged || isLoading} error={localErrorCode === ERRORCODES.ERROR_INCORRECT_PASSWORD} required name="confirm_password" type="password" fullWidth label={t("confirm_password_label")} margin="normal" InputProps={{
          startAdornment: <InputAdornment position="start"><ConfirmPasswordIcon /></InputAdornment>,
        }} inputRef={confirmPasswordRef} />

        {
          (authcode.state === STATES.STATE_READY || (authcode.state === STATES.STATE_ERROR && errorCode === ERRORCODES.ERROR_INCORRECT_CODE)) &&
          <TextField disabled={isLogged || isLoading} error={errorCode === ERRORCODES.ERROR_INCORRECT_CODE} required name="validation_code" type="number" fullWidth label={t("validation_code")} helperText={t("validation_code_timer", { seconds: authcode.lifetime - lostTime })} margin="normal" onChange={onChangeCode} inputRef={validateCodeRef} />
        }

      </DialogContent>
      <DialogActions>
        <Button type="submit" disabled={isLoading || isLogged} onClick={onSubmit} color="primary" variant="contained">{t("button_create")}</Button>
        <Button disabled={isLoading || isLogged} onClick={handleClose} color="secondary" variant="contained">{t("general:button_close")}</Button>
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
    isError: user.state === STATES.STATE_ERROR,
    errorCode: user.errorCode || 0
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  signupRequest: signupActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignupDialog);