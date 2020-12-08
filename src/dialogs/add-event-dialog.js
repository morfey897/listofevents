import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { useTranslation } from "react-i18next";

import { Box, Grid, IconButton, InputAdornment, LinearProgress, makeStyles, Typography, useMediaQuery } from "@material-ui/core";

import { addDays, format } from "date-fns";
import ruLocale from 'date-fns/locale/ru';
import enLocale from 'date-fns/locale/en-US';

import {
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { DIALOGS, LANGS } from "../enums";
import { ERRORCODES } from "../errors";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RichEditor, TagsAutocomplete, CategoryAutocomplete, CityAutocomplete } from "../components";
import { DialogEmitter } from "../emitters";
import { normalizeURL } from "../helpers";
import { Alert } from "@material-ui/lab";
import { stateToHTML } from 'draft-js-export-html';
import { Lock as LockIcon } from "@material-ui/icons";
import { createEventActionCreator } from "../model/actions";

const useStyles = makeStyles((theme) => ({
  marginDense: {
    margin: theme.spacing(1, 0, 0.5)
  }
}));

const NOW = addDays(new Date(), 1);
function AddEventDialog({ open, handleClose, isSuccess, isEditor, isLoading, categories, addEvent }) {

  const { t, i18n } = useTranslation(["add_event_dialog", "general"]);

  const classes = useStyles();
  const fullScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const [errorCode, setErrorCode] = useState(0);

  const [showUrl, setShowUrl] = useState(false);

  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDate, handleDateChange] = useState(null);
  const [selectedTime, handleTimeChange] = useState(null);
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState(null);
  const [city, setCity] = useState(null);

  const [secretKeyCategory, setSecretKeyCategory] = useState(null);

  const descriptionRef = useRef(null);

  const locale = useMemo(() => {
    var locale = enLocale;
    if (i18n.language === LANGS.RU) {
      locale = ruLocale;
    }
    return locale;
  }, [i18n.language]);

  useEffect(() => {
    if (secretKeyCategory) {
      let category = categories.find(({ secretKey }) => secretKeyCategory == secretKey);
      if (category) {
        setCategory(category);
        setSecretKeyCategory(null);
      }
    }
  }, [secretKeyCategory, categories]);

  const onChangeUrl = useCallback((event) => {
    setUrl(normalizeURL(event.target.value));
  }, []);

  const onChangeName = useCallback((event) => {
    let name = event.target.value.replace(/^\s+/g, "");
    setName(name);
    setUrl(normalizeURL(name));
  }, []);

  const onChangePlace = useCallback((event) => {
    let place = event.target.value.replace(/^\s+/g, "");
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

  const onSubmit = useCallback((event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }

    if (url && name && location && selectedDate && category && city) { 
      setErrorCode(0);
      addEvent({
        url: `/${url}`,
        name,
        location,
        date: selectedDate.toISOString(),
        category_id: category._id,
        description: stateToHTML(descriptionRef.current.getEditorState().getCurrentContent()),
        city: {...city},
        tags
      });
    } else {
      setErrorCode(ERRORCODES.ERROR_EMPTY);
    }

  }, [url, name, location, city, selectedDate, category, tags]);

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
      isEditor ? <form onSubmit={onSubmit}>
        <DialogContent>
          <DialogContentText>{t("description")}</DialogContentText>
          {(() => {
            if (errorCode === ERRORCODES.ERROR_EMPTY) {
              return <Alert severity={"error"}>{t('error:empty')}</Alert>;
            } else if (errorCode === ERRORCODES.ERROR_ACCESS_DENIED) {
              return <Alert severity={"error"}>{t('error:access_denied')}</Alert>;
            } else if (errorCode === ERRORCODES.ERROR_INCORRECT_URL) {
              return <Alert severity={"error"}>{t('error:incorrect_url')}</Alert>;
            } else if (errorCode) {
              return <Alert severity={"error"}>{t('error:wrong')}</Alert>;
            }
          })()}
          {isSuccess && <Alert severity={"success"}>{t('success', { category: name })}</Alert>}
          {/* URL */}
          <TextField required name="url" fullWidth label={t("url_label")} value={url} margin="dense"
            disabled={!showUrl}
            InputProps={{
              startAdornment: <InputAdornment position="start">{process.env.HOST + "/"}</InputAdornment>,
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
            <Grid item xs={12} sm={6}>
              <KeyboardDatePicker
                required
                fullWidth
                label={t("date_label")}
                margin="dense"
                clearable
                value={selectedDate}
                placeholder={format(NOW, "dd.MM.yyyy", { locale })}
                onChange={date => {
                  handleDateChange(date);
                }}
                minDate={new Date()}
                format="dd.MM.yyyy"
                animateYearScrolling={true}
                error={errorCode == ERRORCODES.ERROR_EMPTY && !selectedDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <KeyboardTimePicker
                fullWidth
                ampm={false}
                margin="dense"
                label={t("time_label")}
                placeholder={format(NOW, "HH:mm", { locale })}
                mask="__:__"
                value={selectedTime}
                onChange={date => handleTimeChange(date)}
              />
            </Grid>
          </Grid>
          {/* Place name */}
          <TextField
            fullWidth
            required
            error={errorCode == ERRORCODES.ERROR_EMPTY && !location}
            name="location"
            label={t("location_label")}
            helperText={t("location_hint")}
            margin="dense"
            value={location}
            onChange={onChangePlace} />
          {/* City */}
          <Box className={classes.marginDense}>
            <CityAutocomplete value={city} onChange={setCity} error={errorCode == ERRORCODES.ERROR_EMPTY && !city} />
          </Box>
          {/* Category */}
          <Box className={classes.marginDense}>
            <CategoryAutocomplete value={category} onChange={onChangeCategory} error={errorCode == ERRORCODES.ERROR_EMPTY && !category} />
          </Box>
          {/* Description */}
          <Box className={classes.marginDense}>
            <RichEditor placeholder={t("description_label")} innerRef={descriptionRef} />
          </Box>
          {/* Tags */}
          <Box className={classes.marginDense}>
            <TagsAutocomplete values={tags} onChange={setTags} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={onSubmit} color="primary">{t("general:button_create")}</Button>
          <Button onClick={handleClose} color="primary">{t("general:button_cancel")}</Button>
        </DialogActions>
      </form> : <>
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
  const { user, config, categories } = state;
  return {
    isLogged: user.isLogged,
    isEditor: user.isLogged && (user.user.role & config.roles.editor) === config.roles.editor,
    categories: categories.list
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  addEvent: createEventActionCreator
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AddEventDialog);