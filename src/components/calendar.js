import React, { useMemo } from "react";
import { makeStyles, TableContainer, Typography, Card, CardContent, Table, TableBody, TableHead, TableRow, TableCell, ButtonBase } from "@material-ui/core";
import { CALENDAR } from "../i18n";
import { addDays, compareAsc, format, startOfWeek, isSameDay, getMinutes, getHours } from 'date-fns';

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

const useCardStyles = makeStyles((theme) => ({
  card: {
    // width: theme.spacing(10),
    // height: theme.spacing(10),
    // minHeight: "100%"
  },
  cardContent: {
    "&:last-child": {
      paddingBottom: theme.spacing(0)
    },
    padding: theme.spacing(0),
  },
  date: {
    margin: theme.spacing(1)
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
  place_0: {
    backgroundColor: theme.palette.place_0.main,
    color: theme.palette.place_0.contrastText
  },
  place_1: {
    backgroundColor: theme.palette.place_1.main,
    color: theme.palette.place_1.contrastText
  },
  place_2: {
    backgroundColor: theme.palette.place_2.main,
    color: theme.palette.place_2.contrastText
  },
  place_3: {
    backgroundColor: theme.palette.place_3.main,
    color: theme.palette.place_3.contrastText
  },
  place_4: {
    backgroundColor: theme.palette.place_4.main,
    color: theme.palette.place_4.contrastText
  },
  place_5: {
    backgroundColor: theme.palette.place_5.main,
    color: theme.palette.place_5.contrastText
  }
}));

function CardOfDay({ date, enabled, events, colorsPalete }) {
  const classes = useCardStyles();

  return (
    <Card className={classes.card} elevation={events.length ? 1 : 0} square>
      <CardContent className={classes.cardContent}>
        <Typography align="right" color={enabled ? "textPrimary" : "textSecondary"} className={classes.date}>
          {format(date, 'dd')}
        </Typography>
        {events.map(({date, city, category}) => (
          <ButtonBase key={date.toISOString()} className={`${classes.node} ${classes[colorsPalete[city]]}`}>
            <div className={classes.time}>
              {`${("0" + getHours(date)).slice(-2)}:${("0" + getMinutes(date)).slice(-2)}`}
            </div>
            <div className={classes.label}>
              {category}
            </div>
          </ButtonBase>
        ))}
      </CardContent>
    </Card>
  );
}

function Calendar({ date, events, categories, cities }) {

  const i18n = CALENDAR["ru"];

  const classes = useTableStyles();

  const calendarHeaderData = useMemo(() => {
    return [i18n.monShort, i18n.tueShort, i18n.wedShort, i18n.thuShort, i18n.friShort, i18n.satShort, i18n.sunShort];
  }, []);

  const calendarBodyData = useMemo(() => {
    const grid = [];
    let y = date.getFullYear(), m = date.getMonth();
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
          events: events.filter(({date}) => isSameDay(date, curDate)).sort((a, b) => compareAsc(a.date, b.date))
        };
      }
    }
    return grid;
  }, []);

  const colorsPalete = useMemo(() => {
    const palete = {};
    var last = 0;
    for (var i = 0; i < cities.length; i++) {
      var name = cities[i];
      if (!(name in palete)) {
        palete[name] = `place_${last}`;
        last++;
        if (last > 5) {
          last = 0;
        }
      }
    }
    return palete;
  }, []);
// style={{minWidth: minWidth || "auto"}} 
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
                  <CardOfDay {...data} colorsPalete={colorsPalete} />
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