import React, { useMemo } from "react";
import { makeStyles, TableContainer, Typography, Card, CardContent, Table, TableBody, TableHead, TableRow, TableCell, ButtonBase } from "@material-ui/core";
import { addDays, compareAsc, format, startOfWeek, isSameDay, getMinutes, getHours, getMonth, getYear } from 'date-fns';
import {indigo} from '@material-ui/core/colors';

import ruLocale from 'date-fns/locale/ru';

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
  }
}));

const useCardStyles = makeStyles((theme) => {
  const colors = {};
  ["set", "disable"].map(sub => {
    let i = 0;
    do {
      let name = `color_${sub}_${i}`;
      let p = theme.palette[name];
      if (!p) break;
      colors[name] = {
        backgroundColor: p.main,
        color: p.contrastText
      };
      i++;
      // eslint-disable-next-line no-constant-condition
    } while(true);
  });
  
  return  {
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
      backgroundColor: indigo[50],
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
    },
    ...colors
  };
});

const NOW = new Date();

function CardOfDay({ date, enabled, events, cities, categories }) {
  const classes = useCardStyles();

  return (
    <Card className={`${classes.card} ${isSameDay(date, NOW) && classes.nowCard}`} elevation={events.length ? 1 : 0} square>
      <CardContent className={classes.cardContent}>
        <Typography align="right" color={enabled ? "textPrimary" : "textSecondary"}>
          {format(date, 'dd')}
        </Typography>
        {events.map(({_id, date, city, category, past}) => (
          <ButtonBase key={_id} className={`${classes.node} ${classes[`color_${past ? "disable" : "set"}_${Math.min(categories.indexOf(category) + 1, 9)}`]}`}>
            <div className={classes.time}>
              {`${("0" + getHours(date)).slice(-2)}:${("0" + getMinutes(date)).slice(-2)}`}
            </div>
            <div className={classes.label}>
              {city}
            </div>
          </ButtonBase>
        ))}
      </CardContent>
    </Card>
  );
}

function Calendar({ date, events, categories, cities }) {

  const classes = useTableStyles();

  const calendarHeaderData = useMemo(() => {
    return [1,2,3,4,5,6,0].map(day => ruLocale.localize.day(day, {width: 'short'}));
  }, []);

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
          enabled: compareAsc(curDate, firstDate) != -1 && compareAsc(lastDate, curDate) != -1,
          events: events.filter(({date}) => isSameDay(date, curDate) && compareAsc(date, firstDate) != -1 && compareAsc(lastDate, date) != -1)
                        .sort((a, b) => compareAsc(a.date, b.date))
        };
      }
    }
    return grid;
  }, []);

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
                <TableCell key={`body-${index * 6 + indexDay}`} variant="body" className={classes.cellBody}>
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

export default Calendar;