import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';
import MuiPhoneNumber from "material-ui-phone-number";
import { useTranslation } from "react-i18next";
import { Box, debounce, Grid, IconButton, InputAdornment, LinearProgress, makeStyles, Tooltip, Typography } from "@material-ui/core";

import {
  LockOutlined as ConfirmPasswordIcon,
  Lock as PasswordIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
} from '@material-ui/icons';

import { connect } from "react-redux";
import { signupActionCreator } from "../model/actions";
import { bindActionCreators } from "redux";
import { STATES } from "../enums";


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

export const EMAIL_REG_EXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PHONE_REG_EXP = /^\+?\d{10,}$/;
export const NAME_REG_EXP = /^\s*\S{3,}/;

let waitClose;
function SignupDialog({ open, handleClose, username, isLogged, isError, isLoading, signupRequest }) {

  const { t } = useTranslation(["signin_dialog", "general"]);

  const classes = useStyles();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddr, setEmailAddr] = useState("");
  const [isEmpty, setEmpty] = useState(false);
  const [isIncorrectPassword, setIncorrectPassword] = useState(false);

  const nameRef = useRef(null);
  const surnameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  useEffect(() => {
    if (isError) {
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
  }, [isError, isLogged]);

  const onSubmit = useCallback((event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    if (nameRef.current && passwordRef.current && passwordRef.current.value && PHONE_REG_EXP.test(phoneNumber) && EMAIL_REG_EXP.test(emailAddr) && NAME_REG_EXP.test(nameRef.current.value)) {
      if (passwordRef.current.value !== (confirmPasswordRef.current && confirmPasswordRef.current.value || "")) {
        setIncorrectPassword(true);
      } else {
        setEmpty(false);
        signupRequest({
          name: nameRef.current.value, surname: (surnameRef.current && surnameRef.current.value || ""),
          phone: phoneNumber,
          email: emailAddr,
          password: passwordRef.current.value
        });
      }
    } else {
      setEmpty(true);
    }
  }, [phoneNumber, emailAddr]);

  const onChange = useCallback(() => {
    if (nameRef.current && passwordRef.current && PHONE_REG_EXP.test(phoneNumber) && EMAIL_REG_EXP.test(emailAddr) && NAME_REG_EXP.test(nameRef.current.value) && passwordRef.current.value) {
      setEmpty(false);
    }
  }, [phoneNumber, emailAddr]);

  const onEmailChange = useCallback((e) => {
    setEmailAddr((e.target && e.target.value || ""));
    onChange();
  }, []);

  const onPhoneChange = useCallback((value) => {
    setPhoneNumber(value.replace(/\D/g, ""));
    onChange();
  }, []);

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
        {isError && <Alert severity={"error"}>{t("error_incorrect")}</Alert>}
        {isEmpty && <Alert severity={"warning"}>{t("error_empty")}</Alert>}
        {isIncorrectPassword && <Alert severity={"warning"}>{t("error_incorrect_password")}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField disabled={isLogged} fullWidth error={isEmpty && !NAME_REG_EXP.test(nameRef.current && nameRef.current.value || "")} required name="name" type="text" autoFocus label={t("name_label")} margin="normal" inputRef={nameRef} onChange={debounce(onChange, 300)} />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField disabled={isLogged} fullWidth name="name" type="text" label={t("surname_label")} margin="normal" inputRef={surnameRef} />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <MuiPhoneNumber defaultCountry="ua" disabled={isLogged} error={isEmpty && !PHONE_REG_EXP.test(phoneNumber)} value={phoneNumber} required name="phone" type="text" label={t("phone_label")} margin="normal" onChange={onPhoneChange} />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField disabled={isLogged} error={isEmpty && !EMAIL_REG_EXP.test(emailAddr)} value={emailAddr} required name="email" type="email" label={t("email_label")} margin="normal" onChange={onEmailChange} />
          </Grid>
        </Grid>

        <TextField disabled={isLogged} error={isEmpty && passwordRef.current && !passwordRef.current.value} required name="password" type="password" fullWidth label={t("password_label")} margin="normal" InputProps={{
          startAdornment: <InputAdornment position="start"><PasswordIcon /></InputAdornment>,
        }} inputRef={passwordRef} onChange={debounce(onChange, 300)} />

        <TextField disabled={isLogged} required name="confirm_password" type="password" fullWidth label={t("confirm_password_label")} margin="normal" InputProps={{
          startAdornment: <InputAdornment position="start"><ConfirmPasswordIcon /></InputAdornment>,
        }} inputRef={confirmPasswordRef} />

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
  return {
    username: [user.name, user.surname].filter(a => !!a).join(" "),
    isLogged: user.isLogged,
    isLoading: user.state === STATES.STATE_LOADING,
    isError: user.state === STATES.STATE_ERROR
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  signupRequest: signupActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignupDialog);