import { useCallback, useEffect } from "react";
import { Alert } from '@material-ui/lab';
import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, LinearProgress, Typography } from "@material-ui/core";
import { debounce } from "@material-ui/core/utils";
import { connect } from "react-redux";
import { signoutActionCreator } from "../model/actions";
import { bindActionCreators } from "redux";
import { STATUSES } from "../enums";

let waitClose;
function SignoutDialog({ open, handleClose, isLoading, isError, isLogged, signoutRequest }) {

  const { t } = useTranslation(["signout_dialog", "general", "error"]);

  useEffect(() => {
    if (!isLogged || isError) {
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
    <DialogTitle disableTypography className={"boxes"}>
      <Box>
        <Typography align='center' variant="h6" >{t("title")}</Typography>
        {isLoading && <LinearProgress />}
      </Box>
    </DialogTitle>
    <DialogContent>
      {!isLogged && <Alert severity={"success"}>{t("success")}</Alert>}
      {isError && <Alert security={"error"}>{t("error:wrong")}</Alert>}
      <DialogContentText >{t("description")}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button type="submit" onClick={onSubmit} color="primary">{t("general:button_ok")}</Button>
      <Button onClick={handleClose} color="primary">{t("general:button_cancel")}</Button>
    </DialogActions>
  </Dialog>;
}

const mapStateToProps = (state) => {
  const { user } = state;
  return {
    isLogged: user.isLogged,
    isLoading: user.status === STATUSES.STATUS_PENDING,
    isError: user.status === STATUSES.STATUS_ERROR
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  signoutRequest: signoutActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignoutDialog);