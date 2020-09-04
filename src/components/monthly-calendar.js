import React, { useMemo } from "react";
import { makeStyles, TableContainer, Typography, Card, CardContent, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
import { addDays, compareAsc, format, startOfWeek, isSameDay, getMonth, getYear } from 'date-fns';
import {indigo} from '@material-ui/core/colors';

import ruLocale from 'date-fns/locale/ru';
import { capitalCaseTransform } from "capital-case";

import CalendarItem from "./calendar-item";

const useTableStyles = makeStyles((theme) => ({
  cellBody: {
    padding: theme.spacing("4px", "2px"),
    borderBottom: "none",
    verticalAlign: "baseline",
  },
  table: {
    width: "100%",
    tableLayout: "fixed",
    minWidth: `calc(720px - ${theme.spacing(2*3)}px)`,
  },
  nowaday: {
    borderStyle: "solid",
    borderColor: indigo[500],
    borderWidth: 2,

    // borderLeftStyle: "solid",
    // borderLeftWidth: 1,
    // borderLeftColor: indigo[200],

    // borderRightStyle: "solid",
    // borderRightWidth: 1,
    // borderRightColor: indigo[200],
  },
}));

const useCardStyles = makeStyles((theme) => ({
    cardContent: {
      "&:last-child": {
        paddingBottom: theme.spacing(0)
      },
      padding: theme.spacing(0),
    },
    date: {
      margin: theme.spacing(1),
    },
    nowCard: {
      backgroundColor: indigo[100],
    },
}));

const NOW = new Date();

function CardOfDay({ date, disabled, events, cities, categories }) {
  const classes = useCardStyles();

  return (
    <Card elevation={events.length ? 1 : 0} square>
      <CardContent className={classes.cardContent}>
        <Typography align="right" color={disabled ? "textSecondary" : "textPrimary"}>
          {format(date, 'dd')}
        </Typography>
        {events.map(({_id, date, city, category}) => (
          <CalendarItem key={_id} date={date} city={city} disable={compareAsc(date, NOW) == -1} colorIndex={Math.min(categories.indexOf(category) + 1, 9)} />
        ))}
      </CardContent>
    </Card>
  );
}

function MontlyCalendar({ date, events, categories, cities }) {

  const classes = useTableStyles();

  const calendarHeaderData = useMemo(() => {
    const startWeek = startOfWeek(date, {weekStartsOn: 1});
    return [0,1,2,3,4,5,6].map((day) => {
      let curDate = addDays(startWeek, day);
      return capitalCaseTransform(format(curDate, 'eee', {weekStartsOn: 1, locale: ruLocale}));
    });
  }, [date]);

  const calendarBodyData = useMemo(() => {
    const grid = [];
    let y = getYear(date), m = getMonth(date);
    const firstDate = new Date(y, m, 1);
    const lastDate = new Date(y, m + 1, 0);
    let firstWeek = startOfWeek(firstDate, { weekStartsOn: 1 });
    for (let i = 0; i < 6; i++) {
      let line = [];
      grid[i] = line;
      for (let j = 0; j < 7; j++) {
        let curDate = addDays(firstWeek, i * 7 + j);
        line[j] = {
          date: curDate,
          nowaday: isSameDay(curDate, NOW),
          disabled: compareAsc(firstDate, curDate) == 1 || compareAsc(curDate, lastDate) == 1,
          events: events.filter(({date}) => isSameDay(date, curDate) && compareAsc(firstDate, curDate) != 1 && compareAsc(curDate, lastDate) != 1)
                        .sort((a, b) => compareAsc(a.date, b.date))
        };
      }
    }
    return grid;
  }, [date, events]);

  return (
    <TableContainer className={classes.tableContainer}>
      <Table aria-label="a dense table" className={classes.table}>
        <TableHead>
          <TableRow>
            {calendarHeaderData.map((name, index) => (
              <TableCell key={`header-${index}`} variant="head" align="center">
                {name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {calendarBodyData.map((line, index) => (
            <TableRow key={`row-${index}`}>
              {line.map((data, indexDay) => (
                <TableCell key={`body-${index * 6 + indexDay}`} variant="body" className={`${classes.cellBody} ${data.nowaday ? classes.nowaday : ""}`}>
                  <CardOfDay {...data} categories={categories} cities={cities}/>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MontlyCalendar;