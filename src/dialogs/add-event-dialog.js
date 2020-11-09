import React, { useMemo, useRef, useState } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTranslation } from "react-i18next";
import { FormControl, IconButton, Input, InputAdornment, InputLabel, makeStyles, Typography } from "@material-ui/core";

import { addDays, format } from "date-fns";
import ruLocale from 'date-fns/locale/ru';
import enLocale from 'date-fns/locale/en-US';

import {
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { LANGS } from "../enums";
import { useCallback } from "react";


const useStyles = makeStyles((theme) => ({
  form: {
    '& .MuiTextField-root': {
      // margin: theme.spacing(1),
    },
  },
  datetime: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end"
  }
}));

const NOW = addDays(new Date(), 1);
function AddEventDialog({ open, handleClose }) {

  const { t, i18n } = useTranslation(["add-event-dialog", "general"]);

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

  // "name-label": "Name",
  //   "name-helper": "Название не моюет быть пустым",
  //   "description-label": "Description",
  //   "name-description": "Описание слишком короткое",
  //   "place-label": "Place",
  //   "url-label": "Link",
  //   "date-label": "Date",
  //   "time-label": "Time",
  //   "category-label": "Category",
  //   "city-label": "City",
  //   "tags-label": "Tags"
  return <Dialog open={open} onClose={handleClose}>
    <DialogTitle>{t("title")}</DialogTitle>
    <DialogContent>
      <DialogContentText>{t("description")}</DialogContentText>
      <form className={classes.form}>
        <TextField required name="url" fullWidth label={t("url-label")} margin="dense"
          InputProps={{
            startAdornment: <InputAdornment position="start">{process.env.HOST + "/"}</InputAdornment>,
          }} />
        <TextField required name="name" autoFocus fullWidth label={t("name-label")} margin="dense" />
        <TextField required name="location" fullWidth label={t("location-label")} margin="dense" />
        {/* <TextField required name="description" fullWidth multiline rows={3} label={t("description-label")} margin="dense" /> */}

        <div className={classes.datetime}>
          <KeyboardDatePicker
            // InputAdornmentProps={{ position: "start" }}
            label={t("date-label")}
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
            label={t("time-label")}
            placeholder={format(NOW, "HH:mm", { locale })}
            mask="__:__"
            value={selectedTime}
            onChange={date => handleTimeChange(date)}
          />
        </div>

      </form>
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

export default AddEventDialog;