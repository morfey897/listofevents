import { Box, Container, Typography, LinearProgress, Grid } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import Pagination from '@material-ui/lab/Pagination';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { STATUSES } from '../enums';
import { fetchEventsActionCreator, fetchCategoriesActionCreator } from '../model/actions';
import { EventCard, CategoryCard } from "../components/cards";

const useStyles = makeStyles((theme) => ({

  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6)
  },

}));

const LIMIT_ON_PAGE = 20;

function PageEventsScreen({ events, categories, isLoading, fetchEvents, fetchCategories }) {

  const classes = useStyles();
  const { t } = useTranslation("page_events_screen");

  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategories({
      limit: LIMIT_ON_PAGE
    }, {
      sortBy: "updated_at",
      sort: -1
    });
  }, []);

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
    return parseInt(events.total / LIMIT_ON_PAGE) + (events.total % LIMIT_ON_PAGE == 0 ? 0 : 1) + 1;
  }, [events.total]);

  const handleChangePage = useCallback((event, value) => {
    setPage(value);
  }, []);

  const data = useMemo(() => {

    // const len = newServices.length;

    // const t = parseInt(len / every);
    // let withRandom = [];

    // for (let i = 0; i < t; i++) {
    //   let part = newServices.slice(i * every, (i + 1) * every);
    //   part.push({ random: true, key: `rnd${i + 1}`, data: {} });
    //   withRandom = withRandom.concat(part);
    // }
    // newServices = withRandom.concat(newServices.slice(t * every));

    // newServices = newServices.slice(0, newServices.length - t);

    return [].concat(events.ids.map(id => ({
      key: "event:" + id,
      id,
      type: "event"
    }))).concat(categories.ids.map(id => ({
      key: "category:" + id,
      id,
      type: "category"
    })));

  }, [events.total, events.ids, categories.total, categories.ids]);

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
            data.map(({ id, type, key }) => {
              if (type === "event") {
                return <EventCard key={key} _id={id} />;
              } else if (type === "category") {
                return <CategoryCard key={key} _id={id} />;
              }
            })
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
  const { events, categories } = state;
  return {
    isLoading: events.state === STATUSES.STATUS_PENDING || categories.state === STATUSES.STATUS_PENDING,
    events: {
      ids: events.list.map(({ _id }) => _id),
      total: events.total,
      offset: events.offset
    },
    categories: {
      ids: categories.list.map(({ _id }) => _id),
      total: categories.total,
      offset: categories.offset
    }
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchEvents: fetchEventsActionCreator,
  fetchCategories: fetchCategoriesActionCreator
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PageEventsScreen);