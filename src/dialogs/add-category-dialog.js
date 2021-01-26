import { useCallback, useEffect, useMemo, useRef, useState, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";

import { DialogTitle, DialogContentText, Button, TextField, Dialog, DialogActions, Box, DialogContent, IconButton, InputAdornment, LinearProgress, CircularProgress, Typography, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { debounce } from "@material-ui/core/utils";

import { DIALOGS, STATUSES, SCREENS } from "../enums";
import { ERRORCODES, ERRORTYPES } from "../errors";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { TagsAutocomplete, UploadImages } from "../components";
import { DialogEmitter, ErrorEmitter } from "../emitters";
import { normalizeURL } from "../helpers";
import { createCategoryActionCreator, fetchTagsActionCreator, updateCategoryActionCreator } from "../model/actions";
import { Alert, Skeleton } from "@material-ui/lab";
import { Lock as LockIcon } from "@material-ui/icons";
import urljoin from "url-join";
import { withRouter } from "react-router-dom";

const RichEditor = lazy(() => import(/* webpackChunkName: "rich-editor" */"../components/rich-editor"));

const useStyles = makeStyles((theme) => ({
  marginDense: {
    margin: theme.spacing(1, 0, 0.5)
  }
}));

let waitClose;
function AddCategoryDialog({ history, category, open, handleClose, isModerator, isLoading, isLogged, isSuccess, createCategory, updateCategory, categoryName, secretKey }) {

  const { t } = useTranslation(["add_category_dialog", "general", "error"]);

  const classes = useStyles();
  const fullScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const [state, setState] = useState({});

  const [showUrl, setShowUrl] = useState(false);

  const [url, setUrl] = useState(category ? (category.url || "") : (categoryName ? "/" + normalizeURL(categoryName) : ""));
  const [name, setName] = useState(category ? (category.name || "") : (categoryName ? categoryName.replace(/^\s+/g, "") : ""));
  const [tags, setTags] = useState(category && category.tags && [...category.tags] || []);
  const [images, setImages] = useState(category && category.images && [...category.images] || []);
  const [description, setDescription] = useState(category && category.description || "");

  const isReady = useMemo(() => {
    return isSuccess && state.waiting;
  }, [state, isSuccess]);

  useEffect(() => {
    ErrorEmitter.on(ERRORTYPES.CATEGORY_CREATE_ERROR, setState);
    ErrorEmitter.on(ERRORTYPES.CATEGORY_UPDATE_ERROR, setState);
    return () => {
      ErrorEmitter.off(ERRORTYPES.CATEGORY_CREATE_ERROR, setState);
      ErrorEmitter.off(ERRORTYPES.CATEGORY_UPDATE_ERROR, setState);
    };
  }, []);

  useEffect(() => {
    if (isReady) {
      waitClose && waitClose.clear();
      waitClose = debounce(() => {
        handleClose();
        category && history.push(SCREENS.PAGE_EVENTS);
      }, 1000);
      waitClose();
    }
    return () => {
      waitClose && waitClose.clear();
    };
  }, [isReady, category]);

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
      const data = {
        url,
        name,
        description,
        tags,
      };
      if (category) {
        updateCategory({
          _id: category._id,
          ...data,
          url: data.url == event.url ? "" : data.url,
          images: images.filter(f => !(f instanceof File)).map(({ _id }) => _id),
          add_images: images.filter(f => (f instanceof File))
        });
      } else {
        createCategory({
          ...data,
          images
        }, secretKey);
      }
    } else {
      setState({ errorCode: ERRORCODES.ERROR_EMPTY });
    }

  }, [url, name, description, tags, images, secretKey, category]);

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
              <Suspense fallback={<Skeleton variant={"rect"} animation={"wave"} height={186} />}>
                <RichEditor placeholder={t("description_label")} content={description} onChange={setDescription} />
              </Suspense>
            </Box>
            {/* Tags */}
            <Box className={classes.marginDense}>
              <TagsAutocomplete values={tags} onChange={setTags} />
            </Box>
            {/* Upload images */}
            <Box className={classes.marginDense}>
              <UploadImages maxFiles={3} showItems={fullScreen ? 2 : 3} images={images} onChange={setImages} />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button disabled={isLoading || isReady} type="submit" onClick={onSubmit} color="primary">{category ? t("general:button_save") : t("general:button_create")}</Button>
          <Button onClick={handleClose} color="primary">{t("general:button_cancel")}</Button>
        </DialogActions>
      </> : <>
          <DialogContent>
            <DialogContentText>{t("login_description")}</DialogContentText>
          </DialogContent>
          <DialogActions>
            {!isLogged && <Button onClick={onSignin} color="primary">{t("general:button_signin")}</Button>}
            <Button onClick={handleClose} color="primary">{t("general:button_cancel")}</Button>
          </DialogActions>
        </>
    }
  </Dialog>;
}

const mapStateToProps = (state, { _id }) => {
  const { user, config, categories, tags } = state;

  let category = _id && categories.list.find(data => data._id == _id);
  return {
    isLoading: categories.status === STATUSES.STATUS_PENDING,
    isSuccess: categories.status === STATUSES.STATUS_SUCCESS,

    isLogged: user.isLogged,
    isModerator: user.isLogged && (user.user.role & config.roles.moderator) === config.roles.moderator,
    availableTabs: tags.list,
    tagsLoading: tags.status === STATUSES.STATUS_PENDING,

    category
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  createCategory: createCategoryActionCreator,
  updateCategory: updateCategoryActionCreator,
  fetchTags: fetchTagsActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddCategoryDialog));