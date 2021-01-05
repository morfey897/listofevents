import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { useTranslation } from "react-i18next";

import { Box, debounce, Grid, IconButton, InputAdornment, LinearProgress, makeStyles, Typography, useMediaQuery } from "@material-ui/core";

import { addDays, format, formatISO } from "date-fns";

import {
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { DIALOGS, SCREENS, STATUSES } from "../enums";
import { ERRORCODES, ERRORTYPES } from "../errors";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RichEditor, TagsAutocomplete, CategoryAutocomplete, CityAutocomplete, UploadImages } from "../components";
import { DialogEmitter, ErrorEmitter } from "../emitters";
import { normalizeURL } from "../helpers";
import { Alert } from "@material-ui/lab";
import { stateToHTML } from 'draft-js-export-html';
import { Lock as LockIcon } from "@material-ui/icons";
import { createEventActionCreator, updateEventActionCreator } from "../model/actions";
import { useLocale } from "../hooks";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  marginDense: {
    margin: theme.spacing(1, 0, 0.5)
  }
}));

function minToStr(min) {
  return ("0" + parseInt(min / 60)).slice(-2) + ":" + ("0" + (min % 60)).slice(-2);
}

function strToMin(str) {
  return str.split(":").map(a => parseInt(a)).reduce((prev, cur, index) => prev + (cur * (index == 0 ? 60 : (index == 1 ? 1 : 0))), 0);
}

const NOW = addDays(new Date(), 1);
let waitClose;
function AddEventDialog({ history, open, handleClose, isSuccess, isEditor, canDelete, isLoading, categories, event, addEvent, updateEvent }) {

  const { t, i18n } = useTranslation(["add_event_dialog", "general", "error"]);

  const classes = useStyles();
  const fullScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const [state, setState] = useState({});
  const [showUrl, setShowUrl] = useState(false);
  const [url, setUrl] = useState(event && event.url || "");
  const [name, setName] = useState(event && event.name || "");
  const [location, setLocation] = useState(event && event.location || "");
  const [selectedDate, handleDateChange] = useState(event && event.date || null);
  const [duration, setDuration] = useState(event && event.duration ? minToStr(event.duration) : "01:00");
  const [tags, setTags] = useState(event && event.tags && [...event.tags] || []);
  const [images, setImages] = useState(event && event.images && [...event.images] || []);
  const [category, setCategory] = useState(event && event.category && { ...event.category } || null);
  const [city, setCity] = useState(event && event.city && { ...event.city } || null);
  const [secretKeyCategory, setSecretKeyCategory] = useState(null);
  const descriptionRef = useRef(null);

  const locale = useLocale(i18n);

  const isReady = useMemo(() => {
    return isSuccess && state.waiting;
  }, [state, isSuccess]);

  useEffect(() => {
    ErrorEmitter.on(ERRORTYPES.EVENT_CREATE_ERROR, setState);
    ErrorEmitter.on(ERRORTYPES.EVENT_UPDATE_ERROR, setState);
    ErrorEmitter.on(ERRORTYPES.EVENT_DELETE_ERROR, setState);
    return () => {
      ErrorEmitter.off(ERRORTYPES.EVENT_CREATE_ERROR, setState);
      ErrorEmitter.off(ERRORTYPES.EVENT_UPDATE_ERROR, setState);
      ErrorEmitter.off(ERRORTYPES.EVENT_DELETE_ERROR, setState);
    };
  }, []);

  useEffect(() => {
    if (isReady) {
      waitClose && waitClose.clear();
      waitClose = debounce(() => {
        handleClose();
        history.push(SCREENS.PAGE_EVENTS);
      }, 1000);
      waitClose();
    }
    return () => {
      waitClose && waitClose.clear();
    };
  }, [isReady, history]);

  useEffect(() => {
    if (secretKeyCategory) {
      let category = categories.find(({ secretKey }) => secretKeyCategory == secretKey);
      if (category) {
        setCategory(category);
        setSecretKeyCategory(null);
      }
    }
  }, [secretKeyCategory, categories]);

  const onChangeUrl = useCallback((e) => {
    setUrl("/" + normalizeURL(e.target.value));
  }, []);

  const onChangeDuration = useCallback((e) => {
    setDuration(e.target.value);
  }, []);

  const onChangeName = useCallback((e) => {
    let name = e.target.value.replace(/^\s+/g, "");
    setName(name);
    if (!event) {
      setUrl("/" + normalizeURL(name));
    }
  }, [event]);

  const onChangePlace = useCallback((e) => {
    let place = e.target.value.replace(/^\s+/g, "");
    setLocation(place);
  }, []);

  const onChangeCategory = useCallback((category) => {
    setCategory(category);
    if (category && !category._id) {
      let key = parseInt(Math.random() * 1000);
      setSecretKeyCategory(key);
      DialogEmitter.open(DIALOGS.ADD_CATEGORY, { categoryName: category.name, secretKey: key });
    }
  }, []);

  const onSignin = useCallback(() => {
    DialogEmitter.open(DIALOGS.SIGNIN);
  }, []);

  const onSubmit = useCallback((e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    if (url && name && location && selectedDate && category && city) {
      setState({ waiting: true });
      const data = {
        url,
        name,
        location,
        date: formatISO(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60 * 1000),
        duration: strToMin(duration),
        category_id: category._id,
        description: stateToHTML(descriptionRef.current.getEditorState().getCurrentContent()),
        city_id: city._id,
        place_id: city.place_id,
        city_name: city.name,
        city_description: city.description,
        tags,
      };

      if (event) {
        updateEvent({
          _id: event._id,
          ...data,
          url: data.url == event.url ? "" : data.url,
          images: images.filter(f => !(f instanceof File)).map(({ _id }) => _id),
          add_images: images.filter(f => (f instanceof File))
        });
      } else {
        addEvent({
          ...data,
          images
        });
      }
    } else {
      setState({ errorCode: ERRORCODES.ERROR_EMPTY });
    }

  }, [url, name, location, city, selectedDate, category, tags, duration, images, event]);

  const onDelete = useCallback(() => {
    if (canDelete) {
      DialogEmitter.open(DIALOGS.CONFIRM_DELETE, { event_id: event._id });
    }
  }, [canDelete, event]);

  return <Dialog open={open} onClose={handleClose} scroll={"paper"} fullScreen={fullScreen} fullWidth={true} maxWidth={"sm"}>
    <DialogTitle disableTypography={!fullScreen} className={fullScreen ? "" : "boxes"}>
      {fullScreen ?
        <>
          {event ? t("title_edit") : t("title")}
          {(isLoading) && <LinearProgress />}
        </> :
        <Box className={classes.dialogTitle} >
          <Typography align='center' variant="h6" >{event ? t("title_edit") : t("title")}</Typography>
          {(isLoading) && <LinearProgress />}
        </Box>
      }
    </DialogTitle>
    {isEditor ? <>
      <DialogContent dividers={true}>
        <form onSubmit={onSubmit}>
          <DialogContentText>{event ? t("description_edit") : t("description")}</DialogContentText>
          {(() => {
            if (state.errorCode === ERRORCODES.ERROR_EMPTY) {
              return <Alert severity={"error"}>{t('error:empty')}</Alert>;
            } else if (state.errorCode === ERRORCODES.ERROR_ACCESS_DENIED) {
              return <Alert severity={"error"}>{t('error:access_denied')}</Alert>;
            } else if (state.errorCode === ERRORCODES.ERROR_INCORRECT_URL) {
              return <Alert severity={"error"}>{t('error:incorrect_url')}</Alert>;
            } else if (state.errorCode === ERRORCODES.ERROR_CATEGORY_NOT_EXIST) {
              return <Alert severity={"error"}>{t('error:incorrect_category')}</Alert>;
            } else if (state.errorCode === ERRORCODES.ERROR_CITY_NOT_EXIST) {
              return <Alert severity={"error"}>{t('error:incorrect_city')}</Alert>;
            } else if (state.errorCode) {
              return <Alert severity={"error"}>{t('error:wrong')}</Alert>;
            }
          })()}
          {isReady && <Alert severity={"success"}>{t('success', { event: name })}</Alert>}
          {/* URL */}
          <TextField required name="url" fullWidth label={t("url_label")} value={url} margin="dense"
            disabled={!showUrl}
            InputProps={{
              startAdornment: <InputAdornment position="start">{process.env.HOST}</InputAdornment>,
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
          <TextField required name="name" autoFocus fullWidth label={t("name_label")} value={name} margin="dense" onChange={onChangeName} />
          {/* Date & time */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <KeyboardDateTimePicker
                required
                fullWidth
                disablePast
                ampm={false}
                label={t("date_label")}
                margin="dense"

                value={selectedDate}

                onChange={handleDateChange}
                placeholder={format(NOW, "dd.MM.yyyy HH:mm", { locale })}

                format="dd.MM.yyyy HH:mm"
                animateYearScrolling={true}
                error={state.errorCode == ERRORCODES.ERROR_EMPTY && !selectedDate}
              />

            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="duration"
                label={t("duration_label")}
                type="time"
                margin="dense"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={onChangeDuration}
                value={duration}
              />
            </Grid>
          </Grid>
          {/* Place name */}
          <TextField
            fullWidth
            required
            error={state.errorCode == ERRORCODES.ERROR_EMPTY && !location}
            name="location"
            label={t("location_label")}
            helperText={t("location_hint")}
            margin="dense"
            value={location}
            onChange={onChangePlace} />
          {/* City */}
          <Box className={classes.marginDense}>
            <CityAutocomplete value={city} onChange={setCity} error={state.errorCode === ERRORCODES.ERROR_CITY_NOT_EXIST || (state.errorCode == ERRORCODES.ERROR_EMPTY && !city)} />
          </Box>
          {/* Category */}
          <Box className={classes.marginDense}>
            <CategoryAutocomplete value={category} onChange={onChangeCategory} error={state.errorCode === ERRORCODES.ERROR_CATEGORY_NOT_EXIST || (state.errorCode == ERRORCODES.ERROR_EMPTY && !category)} />
          </Box>
          {/* Description */}
          <Box className={classes.marginDense}>
            <RichEditor placeholder={t("description_label")} innerRef={descriptionRef} content={event && event.description || ""} />
          </Box>
          {/* Tags */}
          <Box className={classes.marginDense}>
            <TagsAutocomplete values={tags} onChange={setTags} />
          </Box>
          {/* Upload images */}
          <Box className={classes.marginDense}>
            <UploadImages maxFiles={5} showItems={fullScreen ? 2 : 3} images={images} onChange={setImages} />
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        {canDelete && <Button onClick={onDelete} color="secondary">{t("general:button_delete")}</Button>}
        <Button disabled={isLoading || isReady} type="submit" onClick={onSubmit} color="primary">{event ? t("general:button_save") : t("general:button_create")}</Button>
        <Button onClick={handleClose} color="primary">{t("general:button_cancel")}</Button>
      </DialogActions>
    </> : <>
        <DialogContent dividers={true}>
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

const mapStateToProps = (state, { _id }) => {
  const { user, config, categories, events } = state;

  let event = _id && events.list.find(data => data._id == _id);
  return {
    isLogged: user.isLogged,
    isEditor: user.isLogged && (user.user.role & config.roles.editor) === config.roles.editor,
    canDelete: user.isLogged && ((user.user.role & config.roles.admin) === config.roles.admin || (event && event.author && event.author._id == user.user.id)),

    isLoading: events.status === STATUSES.STATUS_PENDING,
    isSuccess: events.status === STATUSES.STATUS_SUCCESS,
    categories: categories.list,

    event
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  addEvent: createEventActionCreator,
  updateEvent: updateEventActionCreator
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddEventDialog));