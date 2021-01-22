import { Box, Container, Grid, Typography, Link, GridList, GridListTile, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ImgCard, LatestCard } from '../components/cards';
import { useLocale } from '../hooks';
import { format, formatDuration } from "date-fns";
import { Link as RouterLink } from 'react-router-dom';
import urljoin from "url-join";
import { SCREENS, DIALOGS } from '../enums';
import { calcCol } from '../helpers';
import queryString from "query-string";

import {
  Create as EditIcon,
} from '@material-ui/icons';
import { DialogEmitter } from '../emitters';

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

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6)
  },
  imagesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(3)
  },
  tag: {
    marginRight: theme.spacing(1),
  }
}));

function EventScreen({ _id, name, description, date, duration, city, category, images, tags, isModerator }) {

  const classes = useStyles();
  const { t, i18n } = useTranslation("item_calendar_block");
  const locale = useLocale(i18n);

  const tileData = useMemo(() => {
    return images.map(({ url }, index) => ({ img: url, cols: calcCol(images.length, index, 3) }));
  }, [images]);

  const onEditEvent = useCallback(() => {
    isModerator && DialogEmitter.open(DIALOGS.ADD_EVENT, { _id });
  }, [isModerator, _id]);

  return (
    <Container className={classes.container}>
      <Typography variant="h1" align="center" gutterBottom>{name}
        {
          isModerator && <IconButton style={{ verticalAlign: "baseline" }} onClick={onEditEvent}>
            <EditIcon fontSize={"small"} color={"secondary"} />
          </IconButton>
        }
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          {category && <><Typography display="inline" variant="h6">{t("category_label")}</Typography>
            <Typography display="inline" variant="body2">&nbsp;&nbsp;</Typography>
            <Typography display="inline" variant="body1" align="right">
              <Link to={urljoin(SCREENS.CATEGORY, category.url)} component={RouterLink} color={"primary"}>
                {category.name}
              </Link>
            </Typography></>}
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

      <div className={classes.imagesContainer}>
        <GridList cellHeight={240} className={classes.imagesList} cols={3}>
          {tileData.map((tile) => (
            <GridListTile key={tile.img} cols={tile.cols || 1}>
              <img src={tile.img} />
            </GridListTile>
          ))}
        </GridList>
      </div>

      <Box mt={3}>
        {tags.length > 0 && <Grid item xs={12}>
          {tags.map((tag) => <Link className={classes.tag} key={tag} to={urljoin(SCREENS.SEARCH, `?${queryString.stringify({ tag })}`)} component={RouterLink}>{tag}</Link>)}
        </Grid>}
      </Box>

      {/* <Box mt={6}>
        <Grid container justify='center'>
          {
            latestBlogs.map((item) => (
              <Grid key={item.id} item xs={12} md={6} lg={4} className={classes.justifyCenter}>
                <LatestCard {...item} />
              </Grid>
            ))
          }
        </Grid>
      </Box> */}
    </Container>
  );
}

const mapStateToProps = (state, { _id }) => {
  const { events, user, config } = state;

  let event = events.list.find((data) => data._id === _id);

  return {
    name: event && event.name || "",
    description: event && event.description || "",
    category: event && event.category,
    city: event && event.city,
    tags: event && event.tags || [],
    duration: event && event.duration || 0,
    date: event.date,
    images: event.images || [],
    isModerator: user.isLogged && (user.user.role & config.roles.moderator) === config.roles.moderator,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  // fetchEvents: fetchEventsActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EventScreen);