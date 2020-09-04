import React, { useMemo } from "react";
import { makeStyles, TableContainer, Typography, Table, TableBody, TableHead, TableRow, TableCell, Box } from "@material-ui/core";
import { compareAsc, format, isSameDay } from 'date-fns';
import {indigo} from '@material-ui/core/colors';

import ruLocale from 'date-fns/locale/ru';
import { capitalCaseTransform } from "capital-case";

import CalendarItem from "./calendar-item";

const useTableStyles = makeStyles((theme) => ({
  cellBody: {
    padding: theme.spacing("4px", "2px"),
    verticalAlign: "baseline",
  },
  cellTime: {
    verticalAlign: "top",
    padding: theme.spacing("4px", "2px")
  },
  table: {
    width: "100%",
    tableLayout: "fixed",
    minWidth: `calc(720px - ${theme.spacing(2*3)}px)`,
  },
  nowaday: {
    borderLeftStyle: "solid",
    borderLeftWidth: 1,
    borderLeftColor: indigo[200],

    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: indigo[200],
  },
}));

const useCardStyles = makeStyles((theme) => (
  {
    cardContent: {
      "&:last-child": {
        paddingBottom: theme.spacing(0)
      },
      padding: theme.spacing(0),
    },
    date: {
      margin: theme.spacing(1),
    },
    node: {
      display: "flex",
      justifyContent: "flex-start",
      width: "100%",
      overflow: "hidden",
      padding: theme.spacing("5px", "5px"),
      marginTop: theme.spacing(1)
    },
    time: {
      fontWeight: 700,
    },
    label: {
      marginLeft: "auto",
      paddingLeft: theme.spacing(1),
    }
  }
));

const NOW = new Date();

function CardOfTime({ disabled, events, cities, categories }) {
  const classes = useCardStyles();
  return (
    <Box className={classes.cardContent}>
      {events.map(({_id, date, city, category}) => (
        <CalendarItem key={_id} date={date} city={city} disable={disabled} colorIndex={Math.min(categories.indexOf(category) + 1, 9)} />
      ))}
    </Box>
  );
}

function TimeCalendar({ dates, events, categories, cities }) {

  const classes = useTableStyles();

  const calendarHeaderData = useMemo(() => {
    const list = dates.map((d) => ({
      label: format(d, 'eee dd.MM', {weekStartsOn: 1, locale: ruLocale}),
      disabled: compareAsc(NOW, d) === 1 && !isSameDay(d, NOW), nowaday: isSameDay(d, NOW)
    }));
    return [{label: ""}].concat(list).map((data) => ({...data, label: capitalCaseTransform(data.label)}));
  }, [dates]);

  const calendarBodyData = useMemo(() => {
    const grid = [];
    const len = dates.length;
    for (let i = 0; i < len; i++) {
      let curDate = dates[i];
      let filterEvents = events.filter(({date}) => isSameDay(date, curDate))
                          .sort((a, b) => compareAsc(a.date, b.date));
    
      for (let j = 0; j < filterEvents.length; j++) {
        let event = filterEvents[j];
        let time = format(event.date, "HH:mm");
        let timeIndex = grid.findIndex(({time: curTime}) => curTime === time);
        if (timeIndex == -1) {
          let week = [];
          for (let d = 0; d < len; d++) {
            let weekDate = dates[d];
            week.push({events: [], disabled: compareAsc(NOW, weekDate) === 1 && !isSameDay(weekDate, NOW), nowaday: isSameDay(weekDate, NOW)});
          }
          timeIndex = grid.push({time, week}) - 1;
        }
        grid[timeIndex].week[i].events.push(event);
      }
    }
    grid.sort(({time: aTime}, {time: bTime}) => aTime > bTime ? 1 : (aTime < bTime ? -1 : 0));
    return grid;
  }, [dates]);

  return (
    <TableContainer className={classes.tableContainer}>
      <Table aria-label="a dense table" className={classes.table}>
        <TableHead>
          <TableRow>
            {calendarHeaderData.map((data, index) => (
              <TableCell key={`header-${index}`} variant="head" className={`${data.nowaday && classes.nowaday}`}>                
                <Typography variant="body1" align="center" color={data.disabled ? "textSecondary" : "textPrimary"}>
                  {data.label}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {calendarBodyData.map(({time, week}) => (
            <TableRow key={time}>
              <TableCell variant="body" className={classes.cellTime}>
                <Typography variant="body1" align="right">
                  {time}
                </Typography>
              </TableCell>
              {week.map((data, index) => (
                <TableCell key={`body-${index}`} variant="body" className={`${classes.cellBody} ${data.nowaday ? classes.nowaday : ""}`}>
                  <CardOfTime {...data} categories={categories} cities={cities}/>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TimeCalendar;