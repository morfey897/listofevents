import React, { useCallback, useEffect } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';
import { useTranslation } from "react-i18next";
import { Box, LinearProgress, makeStyles, Typography } from "@material-ui/core";
import { debounce } from 'debounce';

import { connect } from "react-redux";
import { signoutActionCreator } from "../model/actions";
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
  }
}));

let waitClose;
function SignoutDialog({ open, handleClose, isLoading, isError, isLogged, signoutRequest }) {

  const { t } = useTranslation(["signout_dialog", "general"]);

  const classes = useStyles();

  useEffect(() => {
    if (!isLogged) {
      waitClose && waitClose.clear();
      waitClose = debounce(handleClose, 500);
      waitClose();
    }
    return () => {
      waitClose && waitClose.clear();
    };
  }, [isLogged]);

  const onSubmit = useCallback((event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    signoutRequest();
  }, []);

  return <Dialog open={open} onClose={handleClose}>
    <DialogTitle disableTypography>
      <Box className={classes.dialogTitle} >
        <Typography align='center' variant="h6" >{t("title")}</Typography>
        {isLoading && <LinearProgress />}
      </Box>
    </DialogTitle>
    <DialogContent>
      {!isLogged && <Alert severity={"success"}>{t("success")}</Alert>}
      {isError && <Alert security={"error"}>{t("error")}</Alert>}
      <DialogContentText >{t("description")}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button type="submit" onClick={onSubmit} color="primary" variant="contained">{t("general:button_ok")}</Button>
      <Button onClick={handleClose} color="secondary" variant="contained">{t("general:button_cancel")}</Button>
    </DialogActions>
  </Dialog>;
}

const mapStateToProps = (state) => {
  const { user } = state;
  return {
    isLogged: user.isLogged,
    isLoading: user.state === STATES.STATE_LOADING,
    isError: user.state === STATES.STATE_ERROR
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  signoutRequest: signoutActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignoutDialog);