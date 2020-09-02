import React, { useEffect, useReducer } from "react";
import {Box, Typography, ButtonGroup, Button, makeStyles} from "@material-ui/core";

import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  CalendarViewDay as MonthIcon,
  ViewDay as DayIcon,
  ViewWeek as WeekIcon,
} from '@material-ui/icons';

import { addDays, addMonths, addWeeks, format, startOfWeek, startOfMonth } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';

const useStyles = makeStyles(({palette}) => ({
  selectedButton: {
    '&:disabled': {
      backgroundColor: palette.primary.light,
      color: palette.primary.contrastText,
    }
  }
}));

const MONTH = 'month';
const WEEK = 'week';
const DAY = 'day';

function init({date, type}) {
  
  if (type === MONTH) {
    return {date, type, label: format(startOfMonth(date), 'MMM yyyy', {weekStartsOn: 1, locale: ruLocale})};
  } else if (type === WEEK) {
    const startWeek = startOfWeek(date, {weekStartsOn: 1});
    const endWeek = addDays(startWeek, 6);
    return {date, type, label: format(startWeek, 'dd MMM', {weekStartsOn: 1, locale: ruLocale}) + ' - ' + format(endWeek, 'dd MMM, yyyy', {weekStartsOn: 1, locale: ruLocale})};  
  }
  return {date, type, label: format(date, 'dd MMM yyyy', {weekStartsOn: 1, locale: ruLocale})};
}

function reducer(state, action) {
  if (action.type == 'date') {
    if (state.type === MONTH) {
      return init({date: addMonths(state.date, action.payload), type: state.type});
    } else if (state.type === WEEK) {
      return init({date: addWeeks(state.date, action.payload), type: state.type});
    } else if (state.type === DAY) {
      return init({date: addDays(state.date, action.payload), type: state.type});
    }
  } else if (action.type == 'view') {
    return init({date: state.date, type: action.payload});
  }
}

function Toolbar({type, date, onChange}) {

  const classes = useStyles();

  const [state, dispatch] = useReducer(reducer, {date: date || new Date(), type: type || MONTH}, init);

  useEffect(() => {
    if (typeof onChange === "function") {
      onChange({date: state.date, type: state.type});
    }
  }, [state]); 

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={1}>
      <ButtonGroup color="primary">
        <Button
          onClick={() => dispatch({type: 'date', payload: -1})}
          >
          <PrevIcon />
        </Button>
        <Button
          onClick={() => dispatch({type: 'date', payload: 1})}
          >
          <NextIcon />
        </Button>
      </ButtonGroup>
      <Typography variant="h6">
        {state.label}
      </Typography>
      <ButtonGroup color="primary">
        {[MONTH, WEEK, DAY].map(value => (
          <Button
            key={value}
            disabled={state.type === value}
            className={classes.selectedButton}
            onClick={() => dispatch({type: 'view', payload: value})}
            >
              {value === MONTH && <MonthIcon />}
              {value === WEEK && <WeekIcon />}
              {value === DAY && <DayIcon />}
          </Button>
        ))}
      </ButtonGroup>
    </Box>);
}

export default Toolbar;