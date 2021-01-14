import { Box, CardMedia, Grid, makeStyles, Typography, Link, Hidden } from '@material-ui/core';
import { format, formatDuration } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import urljoin from "url-join";
import { SCREENS, TENSE } from '../../enums';
import { useLocale } from '../../hooks';
import { compareAsc } from 'date-fns';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import queryString from "query-string";

const useStyles = makeStyles((theme) => ({
  justifyCenter: {
    display: 'flex',
    justifyContent: 'center'
  },
  descriptionBox: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    height: "160px",
    margin: theme.spacing(1, 0)
  },
  label: {
    marginRight: theme.spacing(1)
  },
  tag: {
    marginRight: theme.spacing(1)
  }
}));


function EventCard({ image, url, tags, description, date, duration, name, city, category, tense }) {
  const classes = useStyles();

  const { t, i18n } = useTranslation("item_calendar_block");
  const locale = useLocale(i18n);

  const ImgBlock = <RouterLink to={url}>
    <CardMedia component="img" width={370} height={280} image={image} />
  </RouterLink>;

  return (
    <Grid container item spacing={2}>
      <Grid item xs={12} sm={6} md={5} lg={4}>
        <Hidden xsDown>
          {ImgBlock}
        </Hidden>
      </Grid>
      <Grid item xs={12} sm={6} md={7} lg={8}>
        <Typography variant="h4" noWrap>
          <Link component={RouterLink} to={url}>
            {name}
          </Link>
        </Typography>
        <Hidden smUp>
          {ImgBlock}
        </Hidden>
        <div className={classes.descriptionBox} dangerouslySetInnerHTML={{ __html: description }} ></div>
        <Box>
          {category && <Typography display="inline" variant="body2" className={classes.label}>{t("category_label")}</Typography>}
          {category && <Typography display="inline" variant="body2">
            <Link to={urljoin(SCREENS.CATEGORY, category.url)} component={RouterLink} color={"primary"}>
              {category.name}
            </Link>
          </Typography>}
          <Typography display="inline" variant="body1" >&nbsp;&nbsp;{"/"}&nbsp;&nbsp;</Typography>
          <Typography display="inline" variant="body2" className={classes.label}>{t("city_label")}</Typography>
          <Typography display="inline" variant="body2">{city.name}</Typography>
        </Box>

        <Box>
          <Typography display="inline" variant="body2" className={classes.label}>{t("start_label")}</Typography>
          <Typography display="inline" color={tense === TENSE.PAST ? "secondary" : "primary"} variant="body2">{format(date, 'dd MMM HH:mm', { weekStartsOn: 1, locale })}</Typography>

          <Typography display="inline" variant="body1" >&nbsp;&nbsp;{"/"}&nbsp;&nbsp;</Typography>

          <Typography display="inline" variant="body2" className={classes.label}>{t("duration_label")}</Typography>
          <Typography display="inline" variant="body2">{formatDuration({
            hours: duration > 60 ? parseInt(duration / 60) : 0,
            minutes: duration > 60 ? duration % 60 : duration
          }, { format: ['hours', 'minutes'], locale })}</Typography>
        </Box>

        <Box>
          {tags.map((tag) => <Link className={classes.tag} key={tag} to={urljoin(SCREENS.SEARCH, `?${queryString.stringify({ tag })}`)} component={RouterLink}>{tag}</Link>)}
        </Box>
      </Grid>
    </Grid>
  );
}

const mapStateToProps = (state, { _id }) => {
  const { events, filter } = state;
  const { now } = filter;

  let event = events.list.find((data) => data._id === _id);

  let imgObject = (Array.isArray(event.images) ? event.images[0] : event.images);

  return {
    name: event && event.name || "",
    url: event.url,
    description: event && event.description || "",
    category: event && event.category,
    city: event && event.city,
    tags: event && event.tags || [],
    duration: event && event.duration || 0,
    date: event.date,
    tense: compareAsc(now, event.date) == 1 ? TENSE.PAST : TENSE.FUTURE,
    image: imgObject && imgObject.url || process.env.EMPTY_IMAGE
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EventCard);