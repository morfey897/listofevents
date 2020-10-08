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

import { MONTH, DAY, WEEK } from "../static/views";
import { bindActionCreators } from "redux";
import { filterDatesActionCreator, filterViewActionCreator } from "../model/actions/filter-action";
import { connect } from "react-redux";

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
  const mobileSize = useMediaQuery(theme => theme.breakpoints.down('xs'));

  const stateLabel = useMemo(() => {
    if (view === MONTH) {
      return format(startOfMonth(date), 'MMM yyyy', { weekStartsOn: 1, locale: ruLocale });
    } else if (view === WEEK) {
      const startWeek = startOfWeek(date, { weekStartsOn: 1 });
      const endWeek = addDays(startWeek, 6);
      return format(startWeek, 'dd MMM', { weekStartsOn: 1, locale: ruLocale }) + ' - ' + format(endWeek, 'dd MMM, yyyy', { weekStartsOn: 1, locale: ruLocale });
    }
    return format(date, 'dd MMM yyyy', { weekStartsOn: 1, locale: ruLocale });
  }, [view, date]);

  return (
    <>
      <Hidden smUp>
        <Typography variant={"h5"} align="center" >
          {stateLabel}
        </Typography>
      </Hidden>

      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap={"wrap"} p={1}>
        <ButtonGroup color="primary" size={mobileSize ? "small" : "medium"}>
          <Button onClick={() => filterDates(-1)}>
            <PrevIcon />
          </Button>
          <Button onClick={() => filterDates(0)}>
            <NowadayIcon />
          </Button>
          <Button onClick={() => filterDates(1)}>
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
            disabled={view === MONTH}
            disableTouchRipple
            className={classes.selectedButton}
            onClick={() => filterView(MONTH)}
          >
            <MonthIcon />
          </Button>
          <Button
            disabled={view === WEEK}
            disableTouchRipple
            className={classes.selectedButton}
            onClick={() => filterView(WEEK)}
          >
            <WeekIcon />
          </Button>
          <Button
            disabled={view === DAY}
            disableTouchRipple
            className={classes.selectedButton}
            onClick={() => filterView(DAY)}
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