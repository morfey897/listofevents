import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, debounce, InputAdornment, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useTranslation } from "react-i18next";
import {
  Person as NameIcon,
  Lock as PasswordIcon,
} from '@material-ui/icons';
import { connect } from "react-redux";
import { signinActionCreator, signupSocialActionCreator } from "../model/actions";
import { bindActionCreators } from "redux";
import { STATUSES } from "../enums";
import { FacebookEnter } from "../components";
import { ERRORCODES, ERRORTYPES } from "../errors";
import { ErrorEmitter } from "../emitters";

const useStyles = makeStyles(() => ({
  socialButtons: {
    justifyContent: "center",
    "& svg": {
      fontSize: "3rem",
    }
  },
}));

let waitClose;
function SigninDialog({ open, handleClose, username, defaultUsername = "", isLogged, isLoading, signinRequest, signupSocialRequest }) {

  const { t } = useTranslation(["signin_dialog", "general", "error"]);

  const classes = useStyles();

  const [socialEnter, setSocialEnter] = useState({});
  const [state, setState] = useState(0);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    ErrorEmitter.on(ERRORTYPES.USER_ACTION_ERROR, setState);
    return () => {
      ErrorEmitter.off(ERRORTYPES.USER_ACTION_ERROR, setState);
    };
  }, []);

  useEffect(() => {
    if (state.errorCode) {
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
  }, [state.errorCode, isLogged]);

  const onSubmit = useCallback((event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    if (usernameRef.current && passwordRef.current && usernameRef.current.value && passwordRef.current.value) {
      setState({ waiting: true });
      signinRequest({ username: usernameRef.current.value, password: passwordRef.current.value });
    } else {
      setState({ errorCode: ERRORCODES.ERROR_EMPTY });
    }
  }, []);

  const onChange = useCallback(() => {
    if (usernameRef.current && passwordRef.current && usernameRef.current.value && passwordRef.current.value) {
      setState({});
    }
  }, []);

  const onFacebookEnter = useCallback((data) => {
    setSocialEnter(data);
    if (data.status === "logged" && data.me) {
      signupSocialRequest({
        ...data.me,
        type: "facebook",
      });
    }
  }, []);

  return <Dialog open={open} onClose={handleClose}>
    <DialogTitle disableTypography className={"boxes"}>
      <Box>
        <Typography align='center' variant="h6">{t("title")}</Typography>
        {(isLoading || socialEnter.status === "loading") && <LinearProgress />}
      </Box>
    </DialogTitle>
    <DialogActions className={classes.socialButtons}>
      {/* <Tooltip title={t("instagram_enter")}>
        <IconButton onClick={onInstagramEnter}><InstagramIcon style={{ color: "#FF8948" }} /></IconButton>
      </Tooltip> */}
      <FacebookEnter title={t("facebook_enter")} onChange={onFacebookEnter} disabled={(isLogged || socialEnter.status === "logged") || (isLoading || socialEnter.status === "loading")} />
    </DialogActions>
    <form className={classes.form} onSubmit={onSubmit} autoComplete="on">
      <DialogContent>
        <DialogContentText align='center' >{t("description")}</DialogContentText>
        {isLogged && <Alert severity={"success"}>{t("success", { name: username })}</Alert>}

        {(() => {
          if (state.errorCode === ERRORCODES.ERROR_EMPTY) {
            return <Alert severity={"error"}>{t('error:empty')}</Alert>;
          } else if (state.errorCode === ERRORCODES.ERROR_CAN_NOT_CONNECT_SOCIAL) {
            return <Alert severity={"error"}>{t('error:can_not_connect_social')}</Alert>;
          } else if (state.errorCode === ERRORCODES.ERROR_USER_NOT_EXIST) {
            return <Alert severity={"error"}>{t('error:user_not_esist')}</Alert>;
          } else if (state.errorCode) {
            return <Alert severity={"error"}>{t('error:wrong')}</Alert>;
          }
        })()}

        <TextField disabled={(isLogged || socialEnter.status === "logged") || (isLoading || socialEnter.status === "loading")} error={state.errorCode === ERRORCODES.ERROR_EMPTY && usernameRef.current && !usernameRef.current.value} defaultValue={defaultUsername || ""} required name="username" type="text" autoFocus fullWidth label={t("username_label")} margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start"><NameIcon /></InputAdornment>,
          }} inputRef={usernameRef} onChange={debounce(onChange, 300)} autoComplete="on" />

        <TextField disabled={(isLogged || socialEnter.status === "logged") || (isLoading || socialEnter.status === "loading")} required error={state.errorCode === ERRORCODES.ERROR_EMPTY && passwordRef.current && !passwordRef.current.value} name="password" type="password" fullWidth label={t("password_label")} margin="normal" InputProps={{
          startAdornment: <InputAdornment position="start"><PasswordIcon /></InputAdornment>,
        }} inputRef={passwordRef} onChange={debounce(onChange, 300)} autoComplete="on" />

      </DialogContent>
      <DialogActions>
        <Button type="submit" disabled={(isLogged || socialEnter.status === "logged") || (isLoading || socialEnter.status === "loading")} onClick={onSubmit} color="primary">{t("general:button_signin")}</Button>
        <Button onClick={handleClose} color="primary">{t("general:button_close")}</Button>
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
    isLoading: user.status === STATUSES.STATUS_PENDING
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  signinRequest: signinActionCreator,
  signupSocialRequest: signupSocialActionCreator
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SigninDialog);