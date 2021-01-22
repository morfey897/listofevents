import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Typography } from "@material-ui/core";
import { debounce } from "@material-ui/core/utils";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { deleteEventActionCreator } from "../model/actions";
import { DIALOGS, SCREENS, STATUSES } from "../enums";
import { DialogEmitter, ErrorEmitter } from "../emitters";
import { ERRORCODES, ERRORTYPES } from "../errors";
import { Alert } from "@material-ui/lab";
import { withRouter } from "react-router-dom";

let waitClose;
function ConfirmDeleteDialog({ history, open, handleClose, isSuccess, isLoading, event_id, deleteEvent }) {

  const { t } = useTranslation(["confirm_delete_dialog", "general"]);

  const [state, setState] = useState({});

  const deleteRef = useRef(null);

  const isReady = useMemo(() => {
    return isSuccess && state.waiting;
  }, [state, isSuccess]);

  useEffect(() => {
    ErrorEmitter.on(ERRORTYPES.EVENT_DELETE_ERROR, setState);
    return () => {
      ErrorEmitter.off(ERRORTYPES.EVENT_DELETE_ERROR, setState);
    };
  }, []);

  useEffect(() => {
    if (isReady) {
      waitClose && waitClose.clear();
      waitClose = debounce(() => {
        DialogEmitter.close(DIALOGS.ADD_EVENT);
        handleClose();
        history.push(SCREENS.PAGE_EVENTS);
      }, 1000);
      waitClose();
    }
    return () => {
      waitClose && waitClose.clear();
    };
  }, [isReady, history]);

  const onSubmit = useCallback((event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    if (event_id && deleteRef.current.value === "DELETE") {
      setState({ waiting: true });
      deleteEvent(event_id);
    }
  }, [event_id]);

  return <Dialog open={open} onClose={handleClose}>
    <DialogTitle disableTypography className="boxes">
      <Box >
        <Typography align='center' variant="h6" >{t("title")}</Typography>
      </Box>
    </DialogTitle>
    <form onSubmit={onSubmit}>
      <DialogContent>
        <DialogContentText>{t("description")}</DialogContentText>
        {(() => {
          if (state.errorCode === ERRORCODES.ERROR_ACCESS_DENIED) {
            return <Alert severity={"error"}>{t('error:access_denied')}</Alert>;
          } else if (state.errorCode) {
            return <Alert severity={"error"}>{t('error:wrong')}</Alert>;
          }
        })()}
        {isReady && <Alert severity={"success"}>{t('success')}</Alert>}
        <TextField name="validation_code" fullWidth label={"DELETE"} margin="normal" inputRef={deleteRef} />
      </DialogContent>
      <DialogActions>
        <Button disabled={isLoading || isReady} type="submit" onClick={onSubmit} color="secondary" variant="contained">{t("general:button_delete")}</Button>
        <Button onClick={handleClose} color="default" variant="contained">{t("general:button_cancel")}</Button>
      </DialogActions>
    </form>
  </Dialog>;
}

const mapStateToProps = (state) => {
  const { events } = state;

  return {
    isSuccess: events.status === STATUSES.STATUS_SUCCESS,
    isLoading: events.status === STATUSES.STATUS_PENDING,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  deleteEvent: deleteEventActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ConfirmDeleteDialog));