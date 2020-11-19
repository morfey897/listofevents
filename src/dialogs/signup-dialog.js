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
import { Box, LinearProgress, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { cancelable } from 'cancelable-promise';
import { debounce } from 'debounce';

import { signout } from "../api";

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
}));

let waitClose;
function SignupDialog({ open, name, handleClose }) {

  const { t } = useTranslation([name, "general"]);

  const classes = useStyles();

  const [signoutState, setSignout] = useState(false);

  useEffect(() => {
    return () => {
      waitClose && waitClose.clear();
    };
  }, []);

  const onSubmit = useCallback((event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    setSignout(true);
    waitClose && waitClose.clear();
    signout();
    waitClose = debounce(handleClose, 1500);
    waitClose();
  }, []);

  return <Dialog open={open} onClose={handleClose}>
    <DialogTitle disableTypography>
      <Box className={classes.headerBox} >
        <Typography align='center' variant="h6" className={classes.headerBoxTitle} >{t("title")}</Typography>
      </Box>
    </DialogTitle>
    <DialogContent>
      {signoutState && <Alert severity={"success"}>{t("success")}</Alert>}
      <DialogContentText >{t("description")}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button type="submit" onClick={onSubmit} color="primary" variant="contained">{t("general:button_ok")}</Button>
      <Button onClick={handleClose} color="secondary" variant="contained">{t("general:button_cancel")}</Button>
    </DialogActions>
  </Dialog>;
}

export default SignupDialog;