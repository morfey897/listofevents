import { Box, Container, Grid, makeStyles, Typography, Link, GridList, GridListTile, LinearProgress, IconButton } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link as RouterLink } from 'react-router-dom';
import urljoin from "url-join";

import { SCREENS, STATUSES, DIALOGS } from '../enums';
import { calcCol } from '../helpers';
import { fetchCategoriesActionCreator } from '../model/actions';
import { DialogEmitter } from '../emitters';
import {
  Create as EditIcon,
} from '@material-ui/icons';

import queryString from "query-string";

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

function CategoryScreen({ isLoading, hasData, _id, name, description, tags, images, isModerator, fetchCategories }) {

  const classes = useStyles();

  const tileData = useMemo(() => {
    return images.map(({ url }, index) => ({ img: url, cols: calcCol(images.length, index, 3) }));
  }, [images]);

  useEffect(() => {
    if (!hasData) {
      fetchCategories({ ids: [_id] });
    }
  }, [hasData, _id]);

  const onEditEvent = useCallback(() => {
    isModerator && DialogEmitter.open(DIALOGS.ADD_CATEGORY, { _id });
  }, [isModerator, _id]);

  return (<>
    {(isLoading) && <LinearProgress />}
    <Container className={classes.container}>
      <Typography variant="h1" align="center" gutterBottom>{name}
        {
          isModerator && <IconButton style={{ verticalAlign: "baseline" }} onClick={onEditEvent}>
            <EditIcon fontSize={"small"} color={"secondary"} />
          </IconButton>
        }
      </Typography>

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
          {tags.map((tag) => <Link className={classes.tag} key={tag} to={urljoin(SCREENS.SEARCH, `?${queryString.stringify({tag})}`)} component={RouterLink}>{tag}</Link>)}
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
  </>);
}

const mapStateToProps = (state, { _id }) => {
  const { categories, user, config } = state;

  let category = categories.list.find((data) => data._id === _id);

  return {
    isLoading: !category && categories.state == STATUSES.STATUS_PENDING,
    hasData: !!category,
    name: category && category.name || "",
    description: category && category.description || "",
    tags: category && category.tags || [],
    images: category && category.images || [],
    isModerator: user.isLogged && (user.user.role & config.roles.moderator) === config.roles.moderator,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCategories: fetchCategoriesActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CategoryScreen);