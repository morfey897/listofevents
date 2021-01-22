import { useCallback, useEffect, useMemo, useRef, useState, Suspense, lazy } from "react";
import Alert from '@material-ui/lab/Alert';
import { useTranslation } from "react-i18next";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box, Grid, InputAdornment, LinearProgress, Typography, CircularProgress } from "@material-ui/core";
import { debounce } from "@material-ui/core/utils";
import { cancelable } from 'cancelable-promise';

import {
  Lock as PasswordIcon,
  AlternateEmail as EmailIcon,
} from '@material-ui/icons';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { renameActionCreator } from "../model/actions";
import { outhcode } from "../api";
import { STATUSES } from "../enums";
import { ERRORCODES, ERRORTYPES } from "../errors";
import { ErrorEmitter } from "../emitters";

const MuiPhoneInput = lazy(() => import(/* webpackChunkName: "mui-phone-number" */"material-ui-phone-number"));

let waitClose;
let timerUID = 0;
let waitCodePromise;

const ST_WAITING_CODE = "waiting_code";
const ST_WAITING_USER = "waiting_user";
const ST_GONE_CODE = "gone_code";

function ProfileDialog({ open, handleClose, isLoading, isSuccess, username, name, surname, phone, email, renameUser }) {

  const { t } = useTranslation(["profile_dialog", "general", "error"]);

  const [lostTime, setLostTime] = useState(0);

  const [state, setState] = useState({});

  const [changePassword, setChangePassword] = useState(false);
  const [locName, setName] = useState(name);
  const [locSurname, setSurname] = useState(surname);
  const [locPhone, setPhone] = useState(phone);
  const [locEmail, setEmail] = useState(email);
  const [locPassword, setPassword] = useState("");

  const validateCodeRef = useRef(null);

  const isReady = useMemo(() => {
    return isSuccess && state.status == ST_WAITING_USER;
  }, [state, isSuccess]);

  const onErrorHandler = useCallback(({ errorCode }) => {
    setState((state) => ({ ...state, status: errorCode == ERRORCODES.ERROR_INCORRECT_CODE ? ST_GONE_CODE : "", errorCode }));
  }, []);

  useEffect(() => {
    ErrorEmitter.on(ERRORTYPES.USER_ACTION_ERROR, onErrorHandler);
    return () => {
      ErrorEmitter.off(ERRORTYPES.USER_ACTION_ERROR, onErrorHandler);
      waitCodePromise && waitCodePromise.cancel();
    };
  }, []);

  useEffect(() => {
    clearInterval(timerUID);
    if (state.status === ST_GONE_CODE) {
      timerUID = setInterval(() => {
        setLostTime((lostTime) => {
          if (lostTime > state.lifetime) {
            clearInterval(timerUID);
          }
          return Math.min(lostTime + 1, state.lifetime);
        });
      },
        1000);
    }
    return () => {
      clearInterval(timerUID);
    };
  }, [state]);

  useEffect(() => {
    if (isReady) {
      waitClose && waitClose.clear();
      waitClose = debounce(handleClose, 1000);
      waitClose();
    }
    return () => {
      waitClose && waitClose.clear();
    };
  }, [isReady, state]);

  const onSubmit = useCallback((event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    if (name == locName && surname == locSurname && phone == locPhone && email == locEmail && !locPassword) {
      handleClose();
      return;
    }

    if (locPhone || locEmail) {
      if (state.status == ST_GONE_CODE) {
        setState({ ...state, status: ST_WAITING_USER, errorCode: 0 });
        renameUser({
          name: locName,
          surname: locSurname,
          phone: locPhone,
          email: locEmail,
          password: locPassword,
          code: validateCodeRef.current && validateCodeRef.current.value || 0,
        });
      } else if (state.status != ST_WAITING_CODE) {
        setState({ status: ST_WAITING_CODE });
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
              setState({ errorCode });
            } else {
              setState({ status: ST_GONE_CODE, ...data });
            }
          })
          .catch(() => {
            setState({ errorCode: ERRORCODES.ERROR_WRONG });
          });
      }
    } else {
      setState({ errorCode: ERRORCODES.ERROR_EMPTY });
    }

  }, [state, locName, locSurname, locPhone, locEmail, locPassword, name, surname, phone, email]);

  const onChangeCode = useCallback(() => {
    if (state.status === ST_GONE_CODE && validateCodeRef.current && validateCodeRef.current.value.length === state.codeLen) {
      onSubmit();
    }
  }, [state]);

  return <Dialog open={open} onClose={handleClose}>
    <DialogTitle disableTypography className="boxes">
      <Box >
        <Typography align='center' variant="h6" >{t("title")}</Typography>
        {isLoading && <LinearProgress />}
      </Box>
    </DialogTitle>
    <form onSubmit={onSubmit}>
      <DialogContent>
        {isReady && <Alert severity={"success"}>{t("success", { name: username })}</Alert>}
        {!isReady && (state.status === ST_GONE_CODE || state.status === ST_WAITING_USER) && <Alert severity={"success"}>{t(`general:wait_validate_code_${state.type}`, { username: state.username })}</Alert>}
        {!isReady && (() => {
          if (state.errorCode == ERRORCODES.ERROR_EMPTY) {
            return <Alert severity={"warning"}>{t("error:empty")}</Alert>;
          } else if (state.errorCode === ERRORCODES.ERROR_USER_EXIST || state.errorCode === ERRORCODES.ERROR_EXIST_EMAIL || state.errorCode === ERRORCODES.ERROR_EXIST_PHONE) {
            return <Alert severity={"error"}>{t("error:user_esist")}</Alert>;
          } else if (state.errorCode === ERRORCODES.ERROR_WRONG) {
            return <Alert severity={"warning"}>{t("error:wrong")}</Alert>;
          }
        })()}
        <Grid container spacing={1}>
          <Grid item sm={6}>
            <TextField name="name" type="text" fullWidth label={t("name_label")} value={locName} margin="normal" onChange={(event) => setName(event.target.value)} />
          </Grid>
          <Grid item sm={6}>
            <TextField name="surname" type="text" fullWidth label={t("surname_label")} value={locSurname} margin="normal" onChange={(event) => setSurname(event.target.value)} />
          </Grid>
        </Grid>

        <Suspense fallback={<div style={{ textAlign: "center" }}><CircularProgress size={30} /></div>}>
          <MuiPhoneInput fullWidth value={locPhone} onChange={(value) => setPhone(value)} defaultCountry={'ua'} error={(!locPhone && state.errorCode === ERRORCODES.ERROR_EMPTY) || (state.errorCode === ERRORCODES.ERROR_EXIST_PHONE)} />
        </Suspense>

        <TextField error={(!locEmail && state.errorCode === ERRORCODES.ERROR_EMPTY) || state.errorCode === ERRORCODES.ERROR_EXIST_EMAIL} name="email" type="email" fullWidth label={t("email_label")} value={locEmail} margin="normal" onChange={(event) => setEmail(event.target.value)}
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
          (state.status === ST_GONE_CODE || state.status === ST_WAITING_USER) &&
          <TextField disabled={isLoading || isReady} error={state.errorCode === ERRORCODES.ERROR_INCORRECT_CODE || lostTime > state.lifetime} required name="validation_code" type="number" fullWidth label={t("general:validation_code")} helperText={t("general:validation_code_timer", { seconds: state.lifetime - lostTime })} margin="normal" onChange={onChangeCode} inputRef={validateCodeRef} />
        }
      </DialogContent>
      <DialogActions>
        <Button type="submit" disabled={isLoading || isReady} onClick={onSubmit} color="primary" >{t("general:button_save")}</Button>
        <Button disabled={isLoading} onClick={handleClose} color="primary">{t("general:button_cancel")}</Button>
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
    isLoading: user.status === STATUSES.STATUS_PENDING,
    isSuccess: user.status === STATUSES.STATUS_SUCCESS
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  renameUser: renameActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDialog);