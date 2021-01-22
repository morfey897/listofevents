import { useCallback, useState } from 'react';
import { ButtonBase, Popover, Box, Typography, Grid, Link, CardMedia } from "@material-ui/core";
import { makeStyles} from "@material-ui/core/styles";
import { format, formatDuration } from 'date-fns';
import { capitalCaseTransform as capitalCase } from 'change-case';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import urljoin from "url-join";

import { useTranslation } from 'react-i18next';
import { SCREENS, TENSE } from '../../enums';
import { useLocale } from '../../hooks';
import queryString from "query-string";

const useStyles = makeStyles((theme) => {
  return {
    node: {
      display: "flex",
      justifyContent: "flex-start",
      width: "100%",
      overflow: "hidden",
      padding: theme.spacing("5px", "5px"),
      margin: theme.spacing("2px", "1px"),
      "&:last-child": {
        marginBottom: theme.spacing(0)
      }
    },
    time: {
      fontWeight: 700,
    },
    label: {
      marginLeft: "auto",
      paddingLeft: theme.spacing(1),
    },
    popoverBox: {
      maxWidth: "500px"
    },
    descriptionBox: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      maxHeight: "60px"
    },
    tag: {
      marginRight: theme.spacing(1),
    }
  };
});

function ItemOfCalendar({ _id, date, tense, label, colorClass, name, url, category, city, description, duration, tags, image }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const { t, i18n } = useTranslation("item_calendar_block");
  const locale = useLocale(i18n);

  const onOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <ButtonBase className={`${colorClass || ""} ${classes.node}`} onClick={onOpen}>
        <div className={classes.time}>
          {format(date, "HH:mm")}
        </div>
        <div className={classes.label}>
          {capitalCase(label)}
        </div>
      </ButtonBase>
      <Popover
        id={_id}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Box p={2} className={classes.popoverBox}>
          <Typography variant={"h5"}>
            <Link component={RouterLink} to={url}>
              {name}
            </Link>
          </Typography>
          {image && <RouterLink to={url}>
            <CardMedia component="img" height={280} image={image} />
          </RouterLink>}
          {description && <Box component="div" mt={1} className={classes.descriptionBox}>
            <div dangerouslySetInnerHTML={{ __html: description }} ></div>
          </Box>}
          <Box mt={1}>
            <Grid container spacing={1}>
              {city && <>
                <Grid item xs={6}>
                  <Typography variant="body2">{t("city_label")}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align="right" variant="body2">{city.name}</Typography>
                </Grid>
              </>}
              {category && <>
                <Grid item xs={6}>
                  <Typography variant="body2">{t("category_label")}</Typography>
                </Grid>
                <Grid item xs={6}>

                  <Typography align="right" variant="body2">
                    <Link to={urljoin(SCREENS.CATEGORY, category.url)} component={RouterLink} color={"primary"}>
                      {category.name}
                    </Link>
                  </Typography>

                </Grid>
              </>}
              {date && <>
                <Grid item xs={6}>
                  <Typography variant="body2">{t("start_label")}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color={tense === TENSE.PAST ? "secondary" : "primary"} align="right" variant="body2">{format(date, 'dd MMM HH:mm', { weekStartsOn: 1, locale })}</Typography>
                </Grid>
              </>}
              {duration > 0 && <>
                <Grid item xs={6}>
                  <Typography variant="body2">{t("duration_label")}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align="right" variant="body2">{formatDuration({
                    hours: duration > 60 ? parseInt(duration / 60) : 0,
                    minutes: duration > 60 ? duration % 60 : duration
                  }, { format: ['hours', 'minutes'], locale })}</Typography>
                </Grid>
              </>}
              {tags.length > 0 && <Grid item xs={12}>
                {tags.map((tag) => <Link className={classes.tag} key={tag} to={urljoin(SCREENS.SEARCH, `?${queryString.stringify({ tag })}`)} component={RouterLink}>{tag}</Link>)}
              </Grid>}
            </Grid>
          </Box>
        </Box>
      </Popover>
    </>

  );
}


const mapStateToProps = (state, { _id }) => {
  const { events } = state;

  let event = events.list.find((data) => data._id === _id);

  const description = event && event.description || "";
  let imgObject = (Array.isArray(event.images) ? event.images[0] : event.images);
  return {
    name: event && event.name || "",
    url: event && event.url || "",
    description: />\s*[^<\s]+/.test(description) ? description : false,
    category: event && event.category,
    // city: event && event.city,
    tags: event && event.tags || [],
    duration: event && event.duration || 0,
    image: imgObject && imgObject.url || process.env.EMPTY_IMAGE
  };
};

export default connect(mapStateToProps)(ItemOfCalendar);
