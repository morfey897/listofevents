import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';
import { useTranslation } from "react-i18next";
import { Box, Grid, InputAdornment, LinearProgress, makeStyles, Typography } from "@material-ui/core";
import { cancelable } from 'cancelable-promise';

import MuiPhoneInput from "material-ui-phone-number";

import {
  Lock as PasswordIcon,
  AlternateEmail as EmailIcon,
} from '@material-ui/icons';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { renameActionCreator } from "../model/actions";
import { outhcode } from "../api";
import { ERRORCODES, STATES } from "../enums";
import { debounce } from "debounce";

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

function ProfileDialog({ open, handleClose, isLoading, isError, isReady, errorCode, username, name, surname, phone, email, renameUser }) {

  const { t } = useTranslation(["profile_dialog", "general"]);

  const classes = useStyles();

  const [lostTime, setLostTime] = useState(0);
  const [authcode, setAuthCode] = useState({ state: STATES.STATE_NONE });
  const [localErrorCode, setLocalErrorCode] = useState(errorCode);
  const [isWaitSave, setWaitSave] = useState(false);

  const [changePassword, setChangePassword] = useState(false);
  const [locName, setName] = useState(name);
  const [locSurname, setSurname] = useState(surname);
  const [locPhone, setPhone] = useState(phone);
  const [locEmail, setEmail] = useState(email);
  const [locPassword, setPassword] = useState("");

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
      setPassword("");
    }
    if (isReady && isWaitSave) {
      waitClose && waitClose.clear();
      waitClose = debounce(handleClose, 1000);
      waitClose();
    }
    return () => {
      waitClose && waitClose.clear();
    };
  }, [isError, errorCode, isReady, isWaitSave, authcode]);

  const onSubmit = useCallback((event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    if (name == locName && surname == locSurname && phone == locPhone && email == locEmail && !locPassword) {
      handleClose();
      return;
    }

    if (locPhone || locEmail) {
      if (authcode.state === STATES.STATE_NONE) {
        setAuthCode({ state: STATES.STATE_LOADING });
        let username = "";
        if (locEmail && locEmail === email) {
          username = locEmail;
        } else if (locPhone && locPhone === phone) {
          username = locPhone;
        } else {
          username = (locEmail || locPhone);
        }
        waitCodePromise = cancelable(outhcode({ username }))
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
        renameUser({
          name: locName,
          surname: locSurname,
          phone: locPhone,
          email: locEmail,
          password: locPassword,
          code: validateCodeRef.current && validateCodeRef.current.value || 0,
        });
        setWaitSave(true);
      }
    } else {
      setLocalErrorCode(ERRORCODES.ERROR_EMPTY);
    }

  }, [authcode, locName, locSurname, locPhone, locEmail, locPassword, name, surname, phone, email]);

  const onChangeCode = useCallback(() => {
    if (authcode.state === STATES.STATE_READY && validateCodeRef.current && validateCodeRef.current.value.length === authcode.codeLen) {
      onSubmit();
    }
  }, [authcode]);

  return <Dialog open={open} onClose={handleClose}>
    <DialogTitle disableTypography>
      <Box className={classes.dialogTitle} >
        <Typography align='center' variant="h6" >{t("title")}</Typography>
        {isLoading && <LinearProgress />}
      </Box>
    </DialogTitle>
    <form className={classes.form} onSubmit={onSubmit}>
      <DialogContent>
        {(isReady && isWaitSave) && <Alert severity={"success"}>{t("success", { name: username })}</Alert>}
        {
          !(isReady && isWaitSave) && (authcode.state === STATES.STATE_READY || (authcode.state === STATES.STATE_ERROR && errorCode === ERRORCODES.ERROR_INCORRECT_CODE)) &&
          <Alert severity={"success"}>{t(`general:wait_validate_code_${authcode.type}`, { username: authcode.username })}</Alert>
        }
        {localErrorCode === ERRORCODES.ERROR_EMPTY && <Alert severity={"warning"}>{t("error_empty")}</Alert>}
        {(errorCode === ERRORCODES.ERROR_EXIST || errorCode === ERRORCODES.ERROR_EXIST_EMAIL || errorCode === ERRORCODES.ERROR_EXIST_PHONE) && <Alert severity={"error"}>{t("error_user_esist")}</Alert>}
        {localErrorCode === ERRORCODES.ERROR_WRONG && <Alert severity={"warning"}>{t("general:error_wrong")}</Alert>}

        <Grid container spacing={1}>
          <Grid item sm={6}>
            <TextField name="name" type="text" fullWidth label={t("name_label")} value={locName} margin="normal" onChange={(event) => setName(event.target.value)} />
          </Grid>
          <Grid item sm={6}>
            <TextField name="surname" type="text" fullWidth label={t("surname_label")} value={locSurname} margin="normal" onChange={(event) => setSurname(event.target.value)} />
          </Grid>
        </Grid>

        <MuiPhoneInput fullWidth value={locPhone} onChange={(value) => setPhone(value)} defaultCountry={'ua'} error={(!locPhone && localErrorCode === ERRORCODES.ERROR_EMPTY) || (errorCode === ERRORCODES.ERROR_EXIST_PHONE)} />

        <TextField error={(!locEmail && localErrorCode === ERRORCODES.ERROR_EMPTY) || errorCode === ERRORCODES.ERROR_EXIST_EMAIL} name="email" type="email" fullWidth label={t("email_label")} value={locEmail} margin="normal" onChange={(event) => setEmail(event.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment>,
          }} />

        {
          !changePassword ?
            <Button fullWidth={true} onClick={() => setChangePassword(true)} color="default" startIcon={<PasswordIcon />} variant="outlined">{t("button_change_password")}</Button>
            : <TextField name="password" type="password" fullWidth label={t("password_label")} margin="normal" InputProps={{
              startAdornment: <InputAdornment position="start"><PasswordIcon /></InputAdornment>,
            }} value={locPassword} onChange={(event) => setPassword(event.target.value)} />
        }

        {
          (authcode.state === STATES.STATE_READY || (authcode.state === STATES.STATE_ERROR && errorCode === ERRORCODES.ERROR_INCORRECT_CODE)) &&
          <TextField disabled={isLoading || (isReady && isWaitSave)} error={errorCode === ERRORCODES.ERROR_INCORRECT_CODE} required name="validation_code" type="number" fullWidth label={t("general:validation_code")} helperText={t("general:validation_code_timer", { seconds: authcode.lifetime - lostTime })} margin="normal" onChange={onChangeCode} inputRef={validateCodeRef} />
        }
      </DialogContent>
      <DialogActions>
        <Button type="submit" disabled={isLoading || (isReady && isWaitSave)} onClick={onSubmit} color="primary" variant="contained">{t("general:button_save")}</Button>
        <Button disabled={isLoading} onClick={handleClose} color="secondary" variant="contained">{t("general:button_cancel")}</Button>
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
    isLogged: user.isLogged,
    username,
    name: user.isLogged ? user.user.name : "",
    surname: user.isLogged ? user.user.surname : "",
    email: user.isLogged ? user.user.email : "",
    phone: user.isLogged ? user.user.phone : "",
    isLoading: user.state === STATES.STATE_LOADING,
    isError: user.state === STATES.STATE_ERROR,
    isReady: user.state === STATES.STATE_READY,
    errorCode: user.errorCode || 0
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  renameUser: renameActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDialog);