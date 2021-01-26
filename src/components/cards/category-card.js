import { Box, CardMedia, Grid, Typography, Link, Hidden } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { format, formatDuration } from 'date-fns';
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
    marginBottom: "50px"
    // margin: theme.spacing(1, 0)
  },
  label: {
    marginRight: theme.spacing(1)
  },
  tag: {
    marginRight: theme.spacing(1)
  }
}));


function CategoryCard({ image, url, tags, description, name }) {
  const classes = useStyles();

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
          {tags.map((tag) => <Link className={classes.tag} key={tag} to={urljoin(SCREENS.SEARCH, `?${queryString.stringify({ tag })}`)} component={RouterLink}>{tag}</Link>)}
        </Box>
      </Grid>
    </Grid>
  );
}

const mapStateToProps = (state, { _id }) => {
  const { categories } = state;

  let category = categories.list.find((data) => data._id === _id);

  let imgObject = (Array.isArray(category.images) ? category.images[0] : category.images);

  return {
    name: category && category.name || "NAME",
    url: urljoin(SCREENS.CATEGORY, category.url),
    description: category && category.description || "",
    tags: category && category.tags || [],
    image: imgObject && imgObject.url || process.env.EMPTY_IMAGE
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CategoryCard);