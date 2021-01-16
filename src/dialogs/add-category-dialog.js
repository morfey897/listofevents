import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { useTranslation } from "react-i18next";

import { Box, debounce, IconButton, InputAdornment, LinearProgress, makeStyles, Typography, useMediaQuery } from "@material-ui/core";

import { DIALOGS, STATUSES, SCREENS } from "../enums";
import { ERRORCODES, ERRORTYPES } from "../errors";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RichEditor, TagsAutocomplete, UploadImages } from "../components";
import { DialogEmitter, ErrorEmitter } from "../emitters";
import { normalizeURL } from "../helpers";
import { createCategoryActionCreator, fetchTagsActionCreator } from "../model/actions";
import { Alert } from "@material-ui/lab";
import { stateToHTML } from 'draft-js-export-html';
import { Lock as LockIcon } from "@material-ui/icons";
import urljoin from "url-join";

const useStyles = makeStyles((theme) => ({
  marginDense: {
    margin: theme.spacing(1, 0, 0.5)
  }
}));

let waitClose;
function AddCategoryDialog({ open, handleClose, isModerator, isLoading, isSuccess, createCategory, categoryName, secretKey }) {

  const { t } = useTranslation(["add_category_dialog", "general", "error"]);

  const classes = useStyles();
  const fullScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const [state, setState] = useState({});

  const [showUrl, setShowUrl] = useState(false);

  const [url, setUrl] = useState(categoryName ? normalizeURL(categoryName) : "");
  const [name, setName] = useState(categoryName ? categoryName.replace(/^\s+/g, "") : "");
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);

  const descriptionRef = useRef(null);

  const isReady = useMemo(() => {
    return isSuccess && state.waiting;
  }, [state, isSuccess]);

  useEffect(() => {
    ErrorEmitter.on(ERRORTYPES.EVENT_CREATE_ERROR, setState);
    return () => {
      ErrorEmitter.off(ERRORTYPES.EVENT_CREATE_ERROR, setState);
    };
  }, []);

  useEffect(() => {
    if (isReady) {
      waitClose && waitClose.clear();
      waitClose = debounce(handleClose, 1000);
      waitClose();
    }
    return () => {
      waitClose && waitClose.clear();
    };
  }, [isReady]);

  const onChangeUrl = useCallback((event) => {
    setUrl("/" + normalizeURL(event.target.value));
  }, []);

  const onChangeName = useCallback((event) => {
    let name = event.target.value.replace(/^\s+/g, "");
    setName(name);
    setUrl("/" + normalizeURL(name));
  }, []);

  const onSignin = useCallback(() => {
    DialogEmitter.open(DIALOGS.SIGNIN);
  }, []);

  const onSubmit = useCallback((event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    if (url && name) {
      setState({ waiting: true });
      createCategory({
        url,
        name,
        tags,
        description: stateToHTML(descriptionRef.current.getEditorState().getCurrentContent()),
        images
      }, secretKey);
    } else {
      setState({ errorCode: ERRORCODES.ERROR_EMPTY });
    }

  }, [url, name, tags, images, secretKey]);

  return <Dialog open={open} onClose={handleClose} scroll={"paper"} fullScreen={fullScreen} fullWidth={true} maxWidth={"sm"}>
    <DialogTitle disableTypography={!fullScreen} className={fullScreen ? "" : "boxes"}>
      {fullScreen ?
        <>
          {t("title")}
          {(isLoading) && <LinearProgress />}
        </> :
        <Box className={classes.dialogTitle} >
          <Typography align='center' variant="h6" >{t("title")}</Typography>
          {(isLoading) && <LinearProgress />}
        </Box>
      }
    </DialogTitle>
    {
      isModerator ? <>
        <DialogContent dividers={true}>
          <form onSubmit={onSubmit}>
            <DialogContentText>{t("description")}</DialogContentText>
            {(() => {
              if (state.errorCode === ERRORCODES.ERROR_EMPTY) {
                return <Alert severity={"error"}>{t('error:empty')}</Alert>;
              } else if (state.errorCode === ERRORCODES.ERROR_ACCESS_DENIED) {
                return <Alert severity={"error"}>{t('error:access_denied')}</Alert>;
              } else if (state.errorCode === ERRORCODES.ERROR_INCORRECT_URL) {
                return <Alert severity={"error"}>{t('error:incorrect_url')}</Alert>;
              } else if (state.errorCode) {
                return <Alert severity={"error"}>{t('error:wrong')}</Alert>;
              }
            })()}
            {isReady && <Alert severity={"success"}>{t('success', { category: name })}</Alert>}
            {/* URL */}
            <TextField required name="url" fullWidth label={t("url_label")} value={url} margin="dense"
              disabled={!showUrl}
              InputProps={{
                startAdornment: <InputAdornment position="start">{urljoin(process.env.HOST, SCREENS.CATEGORY)}</InputAdornment>,
                endAdornment: <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowUrl(true)}
                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}
                  >
                    {!showUrl && <LockIcon />}
                  </IconButton>
                </InputAdornment>
              }}
              onChange={onChangeUrl} />
            {/* Name */}
            <TextField required error={state.errorCode === ERRORCODES.ERROR_EMPTY && !url} name="name" autoFocus fullWidth label={t("name_label")} value={name} margin="dense" onChange={onChangeName} />
            {/* Description */}
            <Box className={classes.marginDense}>
              <RichEditor placeholder={t("description_label")} innerRef={descriptionRef} />
            </Box>
            {/* Tags */}
            <Box className={classes.marginDense}>
              <TagsAutocomplete values={tags} onChange={setTags} />
            </Box>
            {/* Upload images */}
            <Box className={classes.marginDense}>
              <UploadImages maxFiles={3} showItems={1} images={images} onChange={setImages} />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button disabled={isLoading || isReady} type="submit" onClick={onSubmit} color="primary">{t("general:button_create")}</Button>
          <Button onClick={handleClose} color="primary">{t("general:button_cancel")}</Button>
        </DialogActions>
      </> : <>
          <DialogContent>
            <DialogContentText>{t("login_description")}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onSignin} color="primary">{t("general:button_signin")}</Button>
            <Button onClick={handleClose} color="primary">{t("general:button_cancel")}</Button>
          </DialogActions>
        </>
    }
  </Dialog>;
}

const mapStateToProps = (state) => {
  const { user, config, categories, tags } = state;

  return {
    isLoading: categories.status === STATUSES.STATUS_PENDING,
    isSuccess: categories.status === STATUSES.STATUS_SUCCESS,

    isLogged: user.isLogged,
    isModerator: user.isLogged && (user.user.role & config.roles.moderator) === config.roles.moderator,
    availableTabs: tags.list,
    tagsLoading: tags.status === STATUSES.STATUS_PENDING,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  createCategory: createCategoryActionCreator,
  fetchTags: fetchTagsActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AddCategoryDialog);