import { useCallback, useEffect, useRef, useState } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, debounce, InputAdornment, LinearProgress, makeStyles, Typography } from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import { useTranslation } from "react-i18next";
import { cancelable } from "cancelable-promise";

import {
  Label as LabelIcon,
  Person as NameIcon,
  LockOutlined as ConfirmPasswordIcon,
  Lock as PasswordIcon,
} from '@material-ui/icons';

import { connect } from "react-redux";
import { signupActionCreator, signupSocialActionCreator } from "../model/actions";
import { bindActionCreators } from "redux";
import { DIALOGS, STATUSES } from "../enums";
import { outhcode } from "../api";
import { ERRORCODES, ERRORTYPES } from "../errors";
import { FacebookEnter, InstagramEnter, GoogleEnter } from "../components";
import { DialogEmitter, ErrorEmitter } from "../emitters";

const useStyles = makeStyles(() => ({
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

function SignupDialog({ open, handleClose, username, isLogged, isLoading, signupRequest, signupSocialRequest }) {

  const { t } = useTranslation(["signin_dialog", "general", "error"]);

  const classes = useStyles();

  const [lostTime, setLostTime] = useState(0);
  const [authcode, setAuthCode] = useState({ status: STATUSES.STATUS_NONE });
  const [state, setState] = useState({});

  const nameRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const validateCodeRef = useRef(null);

  useEffect(() => {
    ErrorEmitter.on(ERRORTYPES.USER_ACTION_ERROR, setState);
    return () => {
      waitCodePromise && waitCodePromise.cancel();
      ErrorEmitter.off(ERRORTYPES.USER_ACTION_ERROR, setState);
    };
  }, []);

  useEffect(() => {
    clearInterval(timerUID);
    if (authcode.status === STATUSES.STATUS_SUCCESS) {
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
    if (state.errorCode && state.errorCode !== ERRORCODES.ERROR_INCORRECT_CODE) {
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
  }, [state, isLogged]);

  const onSubmit = useCallback((event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }

    if (usernameRef.current && passwordRef.current && passwordRef.current.value && usernameRef.current.value) {
      if (passwordRef.current.value !== (confirmPasswordRef.current && confirmPasswordRef.current.value || "")) {
        setState({ errorCode: ERRORCODES.ERROR_INCORRECT_PASSWORD });
      } else {
        if (authcode.status === STATUSES.STATUS_NONE) {
          setAuthCode({ status: STATUSES.STATUS_PENDING });
          waitCodePromise = cancelable(outhcode({ username: usernameRef.current.value }))
            .then(({ success, errorCode, data }) => {
              if (success !== true) {
                setAuthCode({ status: STATUSES.STATUS_ERROR });
                setState({ errorCode });
              } else {
                setAuthCode({ status: STATUSES.STATUS_SUCCESS, ...data });
                setState({});
              }
            })
            .catch(() => {
              setAuthCode({ status: STATUSES.STATUS_ERROR });
              setState({ errorCode: ERRORCODES.ERROR_WRONG });
            });
        } else {
          setState({ waiting: true });
          signupRequest({
            type: "general",
            name: nameRef.current && nameRef.current.value || "",
            username: usernameRef.current.value || "",
            code: validateCodeRef.current && validateCodeRef.current.value || 0,
            password: passwordRef.current.value
          });
        }
      }
    } else {
      setState({ errorCode: ERRORCODES.ERROR_EMPTY });
    }
  }, [authcode]);

  const onChange = useCallback(() => {
    if (usernameRef.current && passwordRef.current && usernameRef.current.value && passwordRef.current.value) {
      setAuthCode({ status: STATUSES.STATUS_NONE });
      setState({});
    }
  }, []);

  const onChangeCode = useCallback(() => {
    if (authcode.status === STATUSES.STATUS_SUCCESS && validateCodeRef.current && validateCodeRef.current.value.length === authcode.codeLen) {
      onSubmit();
    }
  }, [authcode]);

  const onSocialEnter = useCallback((data) => {
    signupSocialRequest({ ...data });
  }, []);

  const onEnterDialog = useCallback(() => {
    DialogEmitter.open(DIALOGS.SIGNIN, { defaultUsername: usernameRef.current && usernameRef.current.value });
    handleClose();
  }, []);

  return <Dialog open={open} onClose={handleClose}>
    <DialogTitle disableTypography className="boxes">
      <Box >
        <Typography align='center' variant="h6">{t("title_signup")}</Typography>
        {isLoading && <LinearProgress />}
      </Box>
    </DialogTitle>
    <DialogActions className={classes.socialButtons}>
      {/* <Tooltip title={t("instagram_enter")}>
        <IconButton><InstagramIcon style={{ color: "#FF8948" }} /></IconButton>
      </Tooltip> */}
      {/* <InstagramEnter title={t("instagram_enter")} onClick={onInstagramEnter} disabled={isLogged || isLoading} />
      <FacebookEnter title={t("facebook_enter")} onClick={onFacebookEnter} disabled={isLogged || isLoading} /> */}
      <GoogleEnter title={t("google_enter")} onClick={onSocialEnter} disabled={isLogged || isLoading} />

    </DialogActions>
    <form className={classes.form} onSubmit={onSubmit}>
      <DialogContent>
        <DialogContentText align='center'>{t("description")}</DialogContentText>
        {isLogged && <Alert severity={"success"}>{t("success", { name: username })}</Alert>}
        {
          !isLogged && (authcode.status === STATUSES.STATUS_SUCCESS || (authcode.status === STATUSES.STATUS_ERROR && state.errorCode === ERRORCODES.ERROR_INCORRECT_CODE)) &&
          <Alert severity={"success"}>{t(`general:wait_validate_code_${authcode.type}`, { username: authcode.username })}</Alert>
        }
        {(() => {
          if (state.errorCode === ERRORCODES.ERROR_EMPTY) {
            return <Alert severity={"error"}>{t('error:empty')}</Alert>;
          } else if (state.errorCode === ERRORCODES.ERROR_INCORRECT_PASSWORD) {
            return <Alert severity={"error"}>{t('error:incorrect_password')}</Alert>;
          } else if (state.errorCode === ERRORCODES.ERROR_USER_EXIST || state.errorCode === ERRORCODES.ERROR_EXIST_EMAIL || state.errorCode === ERRORCODES.ERROR_EXIST_PHONE) {
            return <Alert severity={"warning"} action={
              <Button size="small" onClick={onEnterDialog}>
                {t("enter_user")}
              </Button>
            }>{t('error:user_esist')}</Alert>;
          } else if (state.errorCode === ERRORCODES.ERROR_INCORRECT_USERNAME) {
            return <Alert severity={"error"}>{t('error:incorrect_username')}</Alert>;
          } else if (state.errorCode === ERRORCODES.ERROR_CAN_NOT_CONNECT_SOCIAL) {
            return <Alert severity={"error"}>{t('error:can_not_connect_social')}</Alert>;
          } else if (state.errorCode) {
            return <Alert severity={"error"}>{t('error:wrong')}</Alert>;
          }
        })()}

        <TextField disabled={isLogged || isLoading} name="name" type="text" autoFocus fullWidth label={t("name_label")} margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start"><NameIcon /></InputAdornment>,
          }} inputRef={nameRef} />

        <TextField disabled={isLogged || isLoading} error={(state.errorCode === ERRORCODES.ERROR_EMPTY && (!usernameRef.current || !usernameRef.current.value)) || state.errorCode === ERRORCODES.ERROR_INCORRECT_USERNAME} required name="username" type="text" fullWidth label={t("username_label")} margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start"><LabelIcon /></InputAdornment>,
          }} inputRef={usernameRef} onChange={debounce(onChange, 300)} autoComplete="on" />

        <TextField disabled={isLogged || isLoading} error={state.errorCode === ERRORCODES.ERROR_EMPTY && (!passwordRef.current || !passwordRef.current.value)} required name="password" type="password" fullWidth label={t("password_label")} margin="normal" InputProps={{
          startAdornment: <InputAdornment position="start"><PasswordIcon /></InputAdornment>,
        }} inputRef={passwordRef} onChange={debounce(onChange, 300)} autoComplete="on" />

        <TextField disabled={isLogged || isLoading} error={state.errorCode === ERRORCODES.ERROR_INCORRECT_PASSWORD} required name="confirm_password" type="password" fullWidth label={t("confirm_password_label")} margin="normal" InputProps={{
          startAdornment: <InputAdornment position="start"><ConfirmPasswordIcon /></InputAdornment>,
        }} inputRef={confirmPasswordRef} />

        {
          (authcode.status === STATUSES.STATUS_SUCCESS || (authcode.status === STATUSES.STATUS_ERROR && state.errorCode === ERRORCODES.ERROR_INCORRECT_CODE)) &&
          <TextField disabled={isLogged || isLoading} error={state.errorCode === ERRORCODES.ERROR_INCORRECT_CODE} required name="validation_code" type="number" fullWidth label={t("general:validation_code")} helperText={t("general:validation_code_timer", { seconds: authcode.lifetime - lostTime })} margin="normal" onChange={onChangeCode} inputRef={validateCodeRef} />
        }

      </DialogContent>
      <DialogActions>
        <Button type="submit" disabled={isLogged || isLoading} onClick={onSubmit} color="primary" >{t("general:button_create")}</Button>
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
    isLoading: user.status === STATUSES.STATUS_PENDING,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  signupRequest: signupActionCreator,
  signupSocialRequest: signupSocialActionCreator
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignupDialog);