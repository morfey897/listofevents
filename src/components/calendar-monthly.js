import React, { useMemo } from "react";
import { makeStyles, TableContainer, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
import { addDays, compareAsc, format, startOfWeek, isSameDay, getMonth, getYear } from 'date-fns';
import { indigo } from '@material-ui/core/colors';

import ruLocale from 'date-fns/locale/ru';
import enLocale from 'date-fns/locale/en-US';

import { capitalCaseTransform } from "capital-case";
import { CardOfDay } from "./cards";
import { connect } from "react-redux";
import { LANGS } from "../enums";
import { useTranslation } from "react-i18next";

const useTableStyles = makeStyles((theme) => ({
  tableContainer: {
    padding: theme.spacing(1)
  },
  cellBody: {
    padding: theme.spacing("4px", "2px"),
    borderBottom: "none",
    verticalAlign: "baseline",
  },
  table: {
    width: "100%",
    tableLayout: "fixed",
    minWidth: `calc(720px - ${theme.spacing(2 * 3)}px)`,
  },
  nowaday: {
    borderStyle: "solid",
    borderColor: indigo[500],
    borderWidth: 1,
  },
}));

function CalendarMontly({ date, events, now }) {

  const classes = useTableStyles();
  const { i18n } = useTranslation();

  const calendarHeaderData = useMemo(() => {
    let locale = enLocale;
    if (i18n.language === LANGS.RU) {
      locale = ruLocale;
    }

    const startWeek = startOfWeek(date, { weekStartsOn: 1 });
    return [0, 1, 2, 3, 4, 5, 6].map((day) => {
      let curDate = addDays(startWeek, day);
      return capitalCaseTransform(format(curDate, 'eee', { weekStartsOn: 1, locale }));
    });
  }, [date, i18n.language]);

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
          nowaday: isSameDay(curDate, now),
          disabled: compareAsc(firstDate, curDate) == 1 || compareAsc(curDate, lastDate) == 1,
          events: events.filter(({ date }) => isSameDay(date, curDate) && compareAsc(firstDate, curDate) != 1 && compareAsc(curDate, lastDate) != 1)
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
                    <CardOfDay {...data} />
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
  const { date, now } = state.filter;
  return {
    now,
    date
  };
};

export default connect(mapStateToProps)(CalendarMontly);