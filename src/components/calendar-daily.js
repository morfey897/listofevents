import React, { useMemo } from "react";
import { makeStyles, TableContainer, Typography, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
import { addDays, compareAsc, differenceInDays, format, isSameDay } from 'date-fns';
import {indigo} from '@material-ui/core/colors';

import ruLocale from 'date-fns/locale/ru';
import { capitalCaseTransform } from "capital-case";
import CardOfTime from "./card-of-time";
import { connect } from "react-redux";

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

function CalendarDaily({ dates, events, now }) {

  const classes = useTableStyles();

  const calendarHeaderData = useMemo(() => {
    const list = dates.map((d) => ({
      label: format(d, 'eee dd.MM', {weekStartsOn: 1, locale: ruLocale}),
      disabled: compareAsc(now, d) === 1 && !isSameDay(d, now), 
      nowaday: isSameDay(d, now)
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
            week.push({
              events: [], 
              disabled: compareAsc(now, weekDate) === 1 && !isSameDay(weekDate, now),
              nowaday: isSameDay(weekDate, now)
            });
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
              <TableCell key={`header-${index}`} variant="head" className={`${data.nowaday ? classes.nowaday : ""}`}>                
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
                  <CardOfTime {...data}/>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const mapStateToProps = (state) => {
  const {dateFrom, dateTo, now} = state.filter;
  const len = differenceInDays(dateTo, dateFrom);
  return {
    dates: new Array(len + 1).fill().map((_, i) => addDays(dateFrom, i)),
    now
  };
};

export default connect(mapStateToProps)(CalendarDaily);