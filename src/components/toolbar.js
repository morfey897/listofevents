import React, { useMemo } from "react";
import { Box, Typography, ButtonGroup, Button, makeStyles, useMediaQuery, Hidden } from "@material-ui/core";

import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  CalendarViewDay as MonthIcon,
  ViewDay as DayIcon,
  ViewWeek as WeekIcon,
  Adjust as NowadayIcon,
} from '@material-ui/icons';

import { addDays, format, startOfWeek, startOfMonth } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import enLocale from 'date-fns/locale/en-US';

import { VIEWS, LANGS } from "../enums";
import { bindActionCreators } from "redux";
import { filterDatesActionCreator, filterViewActionCreator } from "../model/actions/filter-action";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

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

function Toolbar({ view, date, filterView, filterDates }) {

  const classes = useStyles();
  const {i18n} = useTranslation();

  const mobileSize = useMediaQuery(theme => theme.breakpoints.down('xs'));

  const stateLabel = useMemo(() => {
    let locale = enLocale;
    if (i18n.language === LANGS.RU) {
      locale = ruLocale;
    }

    if (view === VIEWS.MONTH) {
      return format(startOfMonth(date), 'MMM yyyy', { weekStartsOn: 1, locale });
    } else if (view === VIEWS.WEEK) {
      const startWeek = startOfWeek(date, { weekStartsOn: 1 });
      const endWeek = addDays(startWeek, 6);
      return format(startWeek, 'dd MMM', { weekStartsOn: 1, locale }) + ' - ' + format(endWeek, 'dd MMM, yyyy', { weekStartsOn: 1, locale });
    }
    return format(date, 'dd MMM yyyy', { weekStartsOn: 1, locale });
  }, [view, date, i18n.language]);

  return (
    <>
      <Hidden smUp>
        <Typography variant={"h5"} align="center" >
          {stateLabel}
        </Typography>
      </Hidden>

      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap={"wrap"} p={1}>
        <ButtonGroup color="primary" size={mobileSize ? "small" : "medium"}>
          <Button onClick={() => filterDates(-1)} variant="contained">
            <PrevIcon />
          </Button>
          <Button onClick={() => filterDates(0)} variant="contained">
            <NowadayIcon />
          </Button>
          <Button onClick={() => filterDates(1)} variant="contained">
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
            disabled={view === VIEWS.MONTH}
            disableTouchRipple
            className={classes.selectedButton}
            onClick={() => filterView(VIEWS.MONTH)}
            variant="contained"
          >
            <MonthIcon />
          </Button>
          <Button
            disabled={view === VIEWS.WEEK}
            disableTouchRipple
            className={classes.selectedButton}
            onClick={() => filterView(VIEWS.WEEK)}
            variant="contained"
          >
            <WeekIcon />
          </Button>
          <Button
            disabled={view === VIEWS.DAY}
            disableTouchRipple
            className={classes.selectedButton}
            onClick={() => filterView(VIEWS.DAY)}
            variant="contained"
          >
            <DayIcon />
          </Button>
        </ButtonGroup>
      </Box>
    </>
  );
}


const mapStateToProps = (state) => {
  return {
    view: state.filter.view,
    date: state.filter.date,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  filterView: filterViewActionCreator,
  filterDates: filterDatesActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);