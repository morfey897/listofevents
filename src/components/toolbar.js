import React, { useCallback, useState } from "react";
import { Box, Typography, ButtonGroup, Button, makeStyles, useMediaQuery, Hidden } from "@material-ui/core";

import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  CalendarViewDay as MonthIcon,
  ViewDay as DayIcon,
  ViewWeek as WeekIcon,
  Adjust as NowadayIcon,
} from '@material-ui/icons';

import { addDays, addMonths, addWeeks, format, startOfWeek, startOfMonth } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';

import { MONTH, DAY, WEEK } from "../static/views";

const useStyles = makeStyles(({ palette }) => ({
  selectedButton: {
    '&:disabled': {
      backgroundColor: palette.primary.light,
      color: palette.primary.contrastText,
    },
    "&:hover.Mui-disabled": {
      backgroundColor: palette.primary.light,
      color: palette.primary.contrastText,
    }
  }
}));

function createLabel(date, type) {
  if (type === MONTH) {
    return format(startOfMonth(date), 'MMM yyyy', { weekStartsOn: 1, locale: ruLocale });
  } else if (type === WEEK) {
    const startWeek = startOfWeek(date, { weekStartsOn: 1 });
    const endWeek = addDays(startWeek, 6);
    return format(startWeek, 'dd MMM', { weekStartsOn: 1, locale: ruLocale }) + ' - ' + format(endWeek, 'dd MMM, yyyy', { weekStartsOn: 1, locale: ruLocale });
  }
  return format(date, 'dd MMM yyyy', { weekStartsOn: 1, locale: ruLocale });
}

function Toolbar({ view, date, onChangeView, onChangeDate }) {

  const classes = useStyles();

  const [stateDate, setDate] = useState(date);
  const [stateView, setView] = useState(view);
  const [stateLabel, setLabel] = useState(createLabel(date, view));

  const handleChangeView = useCallback((view) => {
    setView(view);
    setLabel(createLabel(stateDate, view));
    if (typeof onChangeView === "function") {
      onChangeView(view);
    }
  }, [stateDate]);

  const handleChangeDate = useCallback((num) => {
    let newDate = stateDate;
    if (num === 0) {
      newDate = new Date();
    } else if (stateView === MONTH) {
      newDate = addMonths(stateDate, num);
    } else if (stateView === WEEK) {
      newDate = addWeeks(stateDate, num);
    } else if (stateView === DAY) {
      newDate = addDays(stateDate, num);
    }

    setDate(newDate);
    setLabel(createLabel(newDate, stateView));

    if (typeof onChangeDate === "function") {
      onChangeDate(newDate);
    }
  }, [stateView, stateDate]);

  const mobileSize = useMediaQuery(theme => theme.breakpoints.down('xs'));

  return (
    <>
      <Hidden smUp>
        <Typography variant={"h5"} align="center" >
          {stateLabel}
        </Typography>
      </Hidden>

      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap={"wrap"} p={1}>
        <ButtonGroup color="primary" size={mobileSize ? "small" : "medium"}>
          <Button onClick={() => handleChangeDate(-1)}>
            <PrevIcon />
          </Button>
          <Button onClick={() => handleChangeDate(0)}>
            <NowadayIcon />
          </Button>
          <Button onClick={() => handleChangeDate(1)}>
            <NextIcon />
          </Button>
        </ButtonGroup>
        <Hidden xsDown>
          <Typography variant={"body1"} align="center">
            {stateLabel}
          </Typography>
        </Hidden>
        <ButtonGroup color="primary" size={mobileSize ? "small" : "medium"}>
          <Button
            disabled={stateView === MONTH}
            disableTouchRipple
            className={classes.selectedButton}
            onClick={() => handleChangeView(MONTH)}
          >
            <MonthIcon />
          </Button>
          <Button
            disabled={stateView === WEEK}
            disableTouchRipple
            className={classes.selectedButton}
            onClick={() => handleChangeView(WEEK)}
          >
            <WeekIcon />
          </Button>
          <Button
            disabled={stateView === DAY}
            disableTouchRipple
            className={classes.selectedButton}
            onClick={() => handleChangeView(DAY)}
          >
            <DayIcon />
          </Button>
        </ButtonGroup>
      </Box>
    </>
  );
}

export default Toolbar;