import { Box, Container, makeStyles, Typography, LinearProgress, Grid } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { STATUSES } from '../enums';
import { fetchEventsActionCreator } from '../model/actions';
import { EventCard } from "../components/cards";

const useStyles = makeStyles((theme) => ({

  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6)
  },

}));

const LIMIT_ON_PAGE = 10;

function PageEventsScreen({ eventIds, total, isLoading, fetchEvents }) {

  const classes = useStyles();
  const { t } = useTranslation("page_events_screen");

  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchEvents({}, {
      limit: LIMIT_ON_PAGE,
      offset: (page - 1) * LIMIT_ON_PAGE,
    }, {
      sortBy: "date",
      sort: -1
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
            eventIds.map((id) => (
              <EventCard key={id} _id={id} />
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
  const { events } = state;
  return {
    isLoading: events.state === STATUSES.STATUS_PENDING,
    eventIds: events.list.map(({ _id }) => _id),
    total: events.total,
    offset: events.offset
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchEvents: fetchEventsActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PageEventsScreen);