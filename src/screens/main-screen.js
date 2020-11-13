import { Box, CardMedia, Container, Grid, makeStyles, Typography } from '@material-ui/core';
import { ViewComfy, ViewDay, ViewCarousel } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Factory from '../components/factory';
import Footer from '../components/footer';
import LineSeparator from '../components/separators';
import { INFO_BLOG, LATEST_BLOG } from '../enums/factory';

const items = [
  {
    id: 1,
    icon: ViewComfy,
    title: 'Huge Number of Components',
    text: 'Every element that you need in a product comes built in as a component. All components fit perfectly with each other and can take variations in colour.'
  },
  {
    id: 2,
    icon: ViewDay,
    title: 'Multi-Purpose Sections',
    text: 'Putting together a page has never been easier than matching together sections. From team presentation to pricing options, you can easily customise and built your pages.'
  },
  {
    id: 3,
    icon: ViewCarousel,
    title: 'Example Pages',
    text: 'If you want to get inspiration or just show something directly to your clients, you can jump start your development with our pre-built example pages.'
  }
];

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

const useStyles = makeStyles(() => ({
  alignCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  cardMedia: {
    width: '700px',
    height: '500px'
  },
  grayBackground: {
    background: 'radial-gradient(ellipse at center,#585858 0,#232323 100%)',
    backgroundColor: '#343434'
  }
}));

const MainScreen = () => {
  const {t} = useTranslation("main");
  const classes = useStyles();

  return (
    <>
      <Container>
        <Box mt={6} mx={15}>
          <Typography align='center'>{t("description")}</Typography>
        </Box>
        <Box mt={6}>
          <Grid container>
            {
              items.map((item) => (
                <Grid key={item.id} item xs={12} md={6} lg={4}>
                  <Factory type={INFO_BLOG} props={item} />
                </Grid>
              ))
            }
          </Grid>
        </Box>
        <Box mt={6}>
          <Grid container>
            <Grid item xs={12} lg={5} className={classes.alignCenter}>
              <Box pr={5}>
                <Typography gutterBottom variant="h4">{t("leftBlockTitle")}</Typography>
                <Typography>{t("leftBlockText")}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} lg={7}>
              <CardMedia className={classes.cardMedia} image="http://source.unsplash.com/random" />
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Box mt={6} py={6} className={classes.grayBackground}>
        <Container>
          <Grid container>
            <Grid item xs={12} lg={7}>
              <CardMedia className={classes.cardMedia} image="http://source.unsplash.com/random" />
            </Grid>
            <Grid item xs={12} lg={5} className={classes.alignCenter}>
              <Box pl={5} color='common.white'>
                <Typography  gutterBottom variant="h4">{t("leftBlockTitle")}</Typography>
                <Typography>{t("leftBlockText")}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Container>
        <Box mt={6}>
          <Grid container>
            {
              latestBlogs.map((item) => (
                <Grid key={item.id} item xs={12} md={6} lg={4}>
                  <Factory type={LATEST_BLOG} props={item} />
                </Grid>
              ))
            }
          </Grid>
        </Box>
      </Container>
      <Box mt={5}>
        <LineSeparator/>
      </Box>
      <Footer/>
    </>
  );
};

export default MainScreen;