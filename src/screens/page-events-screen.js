import { Box, Container, makeStyles, Typography, LinearProgress, Grid } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { STATUSES, TENSE } from '../enums';
import { fetchEventsActionCreator } from '../model/actions';
import { EventCard } from "../components/cards";
import { compareAsc } from 'date-fns';

const useStyles = makeStyles((theme) => ({

  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6)
  },

}));

const LIMIT_ON_PAGE = 4;

function PageEventsScreen({ events, total, isLoading, fetchEvents }) {

  const classes = useStyles();
  const { t } = useTranslation("page_events_screen");

  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchEvents({}, {
      limit: LIMIT_ON_PAGE,
      offset: (page - 1) * LIMIT_ON_PAGE,
    },
      {
        field: "date",
        sort: 1
      });
  }, [page]);

  const pages = useMemo(() => {
    return parseInt(total / LIMIT_ON_PAGE) + (total % LIMIT_ON_PAGE == 0 ? 0 : 1);
  }, [total]);

  const handleChangePage = useCallback((event, value) => {
    setPage(value);
  }, []);

  return (
    <>
      {(isLoading) && <LinearProgress />}
      <Container className={classes.container}>
        <Box my={4}>
          <Typography paragraph>
            {t("description")}
          </Typography>
        </Box>
        <Grid container spacing={5}>
          {
            events.map(({ _id, ...props }) => (
              <EventCard key={_id} {...props} />
            ))
          }
        </Grid>
        <Box my={4}>
          <Pagination count={pages} variant="outlined" shape="rounded" page={page} onChange={handleChangePage} disabled={isLoading} />
        </Box>
      </Container>
    </>
  );
}

const mapStateToProps = (state) => {
  const { events, filter } = state;
  const { now } = filter;

  return {
    isLoading: events.state === STATUSES.STATUS_PENDING,
    events: events.list.map(({ _id, url, name, description, tags, date, duration, city, category }) => (
      {
        _id,
        url,
        images: { url: 'http://source.unsplash.com/random' },
        name,
        tags,
        date,
        duration,
        city,
        category,
        tense: compareAsc(now, date) == 1 ? TENSE.PAST : TENSE.FUTURE,
        description: (new Array(20).fill("<p>A lot of texts</p>").join(""))
      }
    )),
    total: events.total,
    offset: events.offset
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchEvents: fetchEventsActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PageEventsScreen);