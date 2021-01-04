import { Box, Container, Grid, makeStyles, Typography, Link, CardMedia } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ImgCard, LatestCard } from '../components/cards';
import { useLocale } from '../hooks';
import { format, formatDuration } from "date-fns";
import { Link as RouterLink } from 'react-router-dom';
import urljoin from "url-join";
import { SCREENS } from '../enums';

const latestBlogs = [
  {
    id: 1,
    img: 'http://source.unsplash.com/random',
    title: 'Autodesk looks to future of 3D printing with Project Escher',
    text: 'Like so many organizations these days, Autodesk is a company in transition. It was until recently a traditional boxed software company selling licenses. Read More'
  },
  {
    id: 2,
    img: 'http://source.unsplash.com/random',
    title: 'Lyft launching cross-platform service this week',
    text: 'Like so many organizations these days, Autodesk is a company in transition. It was until recently a traditional boxed software company selling licenses. Read More'
  },
  {
    id: 3,
    img: 'http://source.unsplash.com/random',
    title: '6 insights into the French Fashion landscape',
    text: 'Like so many organizations these days, Autodesk is a company in transition. It was until recently a traditional boxed software company selling licenses. Read More'
  }
];
const photoArr = [
  {
    id: 1,
    url: 'http://source.unsplash.com/random'
  },
  {
    id: 2,
    url: 'http://source.unsplash.com/random'
  },
  {
    id: 3,
    url: 'http://source.unsplash.com/random'
  }
];

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6)
  },
}));

function EventScreen({ name, description, date, duration, city, category, images }) {

  const classes = useStyles();
  const { t, i18n } = useTranslation("item_calendar_block");
  const locale = useLocale(i18n);

  return (
    <Container className={classes.container}>
      <Typography variant="h1" align="center" gutterBottom>{name}</Typography>
      <Grid container>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Typography display="inline" variant="h6">{t("category_label")}</Typography>
          <Typography display="inline" variant="body2">&nbsp;&nbsp;</Typography>
          <Typography display="inline" variant="body1" align="right">
            <Link to={urljoin(SCREENS.CATEGORY, category.url)} component={RouterLink} color="primary" >
              {category.name}
            </Link>
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Typography display="inline" variant="h6">{t("city_label")}</Typography>
          <Typography display="inline" variant="body2">&nbsp;&nbsp;</Typography>
          <Typography display="inline" variant="body1" align="right">{city.name}</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Typography display="inline" variant="h6">{t("start_label")}</Typography>
          <Typography display="inline" variant="body2">&nbsp;&nbsp;</Typography>
          <Typography display="inline" variant="body1" align="right">{format(date, 'dd MMM HH:mm', { weekStartsOn: 1, locale })}</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Typography display="inline" variant="h6">{t("duration_label")}</Typography>
          <Typography display="inline" variant="body2">&nbsp;&nbsp;</Typography>
          <Typography display="inline" variant="body1" align="right">{formatDuration({
            hours: duration > 60 ? parseInt(duration / 60) : 0,
            minutes: duration > 60 ? duration % 60 : duration
          }, { format: ['hours', 'minutes'], locale })}</Typography>
        </Grid>
      </Grid>
      <Box component="div" mt={1}>
        <div dangerouslySetInnerHTML={{ __html: description }} ></div>
      </Box>
      <Grid container justify='center'>
        {
          images.map((item) => (
            <Grid key={item._id} item xs={12} md={6} lg={4}>
              <CardMedia component="img" width={370} height={280} image={item.url} />
            </Grid>
          ))
        }
      </Grid>
      {/* <Box className={classes.justifyCenter}>
        <Box mt={4} className={classes.textBox}>
          <Typography variant="h4" gutterBottom>{eventTitle}</Typography>
          <Typography className={classes.text}>{eventText}</Typography>
        </Box>
      </Box> */}
      <Box mt={6}>
        <Grid container justify='center'>
          {
            latestBlogs.map((item) => (
              <Grid key={item.id} item xs={12} md={6} lg={4} className={classes.justifyCenter}>
                <LatestCard {...item} />
              </Grid>
            ))
          }
        </Grid>
      </Box>
    </Container>
  );
}

const mapStateToProps = (state, { _id }) => {
  const { events } = state;

  let event = events.list.find((data) => data._id === _id);

  return {
    name: event && event.name || "",
    description: (new Array(20).fill("<p>A lot of texts</p>").join("")), //event && event.description || "",
    category: event && event.category,
    city: event && event.city,
    tags: event && event.tags || [],
    duration: event && event.duration || 0,
    date: event.date,
    images: []
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  // fetchEvents: fetchEventsActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EventScreen);