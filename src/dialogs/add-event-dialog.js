import React, { useMemo, useRef, useState } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTranslation } from "react-i18next";
import { Box, FormControl, IconButton, Input, InputAdornment, InputLabel, LinearProgress, makeStyles, Typography } from "@material-ui/core";

import { addDays, format } from "date-fns";
import ruLocale from 'date-fns/locale/ru';
import enLocale from 'date-fns/locale/en-US';

import {
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { LANGS } from "../enums";
import { useCallback } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";


const useStyles = makeStyles((theme) => ({
  datetime: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end"
  }
}));

const NOW = addDays(new Date(), 1);
function AddEventDialog({ open, handleClose, isEditor, isLoading }) {

  const { t, i18n } = useTranslation(["add_event_dialog", "general"]);

  const classes = useStyles();

  const [selectedDate, handleDateChange] = useState(null);
  const [selectedTime, handleTimeChange] = useState(null);

  const locale = useMemo(() => {
    var locale = enLocale;
    if (i18n.language === LANGS.RU) {
      locale = ruLocale;
    }
    return locale;
  }, [i18n.language]);

  // "name_label": "Name",
  //   "name_helper": "Название не моюет быть пустым",
  //   "description_label": "Description",
  //   "name_description": "Описание слишком короткое",
  //   "place-label": "Place",
  //   "url_label": "Link",
  //   "date_label": "Date",
  //   "time_label": "Time",
  //   "category_label": "Category",
  //   "city_label": "City",
  //   "tags_label": "Tags"
  return <Dialog open={open} onClose={handleClose}>
    <DialogTitle disableTypography className={"boxes"}>
      <Box>
        <Typography align='center' variant="h6" >{isEditor ? t("title") : t("login_title")}</Typography>
        {isLoading && <LinearProgress />}
      </Box>
    </DialogTitle>
    <DialogContent>
      <DialogContentText>{isEditor ? t("description") : t("login_description")}</DialogContentText>
      {isEditor && <form className={classes.form}>
        <TextField required name="url" fullWidth label={t("url_label")} margin="dense"
          InputProps={{
            startAdornment: <InputAdornment position="start">{process.env.HOST + "/"}</InputAdornment>,
          }} />
        <TextField required name="name" autoFocus fullWidth label={t("name_label")} margin="dense" />
        <TextField required name="location" fullWidth label={t("location_label")} margin="dense" />
        {/* <TextField required name="description" fullWidth multiline rows={3} label={t("description_label")} margin="dense" /> */}

        <div className={classes.datetime}>
          <KeyboardDatePicker
            // InputAdornmentProps={{ position: "start" }}
            label={t("date_label")}
            margin="dense"
            clearable
            value={selectedDate}
            placeholder={format(NOW, "dd.MM.yyyy", { locale })}
            onChange={date => handleDateChange(date)}
            minDate={new Date()}
            format="dd.MM.yyyy"
            animateYearScrolling={true}
          />
          <Typography variant="h5" color="textSecondary">{'/'}</Typography>
          <KeyboardTimePicker
            ampm={false}
            margin="dense"
            label={t("time_label")}
            placeholder={format(NOW, "HH:mm", { locale })}
            mask="__:__"
            value={selectedTime}
            onChange={date => handleTimeChange(date)}
          />
        </div>

      </form>}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Cancel
    </Button>
      <Button onClick={handleClose} color="primary">
        Subscribe
    </Button>
    </DialogActions>
  </Dialog>;
}

const mapStateToProps = (state) => {
  const { user, config } = state;

  return {
    isLogged: user.isLogged,
    isEditor: user.isLogged && (user.user.role & config.roles.editor) === config.roles.editor
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AddEventDialog);