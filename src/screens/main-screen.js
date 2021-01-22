import { Box, CardMedia, Container, Grid, Typography } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from 'react-i18next';
import { InfoCard, LatestCard } from '../components/cards';

const items = [
  {
    id: 1,
    icon: "ViewComfy",
    title: 'Huge Number of Components',
    text: 'Every element that you need in a product comes built in as a component. All components fit perfectly with each other and can take variations in colour.'
  },
  {
    id: 2,
    icon: "ViewDay",
    title: 'Multi-Purpose Sections',
    text: 'Putting together a page has never been easier than matching together sections. From team presentation to pricing options, you can easily customise and built your pages.'
  },
  {
    id: 3,
    icon: "ViewCarousel",
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

const useStyles = makeStyles((theme) => ({
  textBox: {
    maxWidth: '700px'
  },
  justifyCenter: {
    display: 'flex',
    justifyContent: 'center'
  },
  alignCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardMedia: {
    width: '700px',
    height: '500px'
  },
  grayBackground: {
    background: `linear-gradient(90deg, ${theme.palette.grey["800"]} 0, ${theme.palette.grey["700"]} 100%)`,
    backgroundColor: theme.palette.grey["800"]
  }
}));

const MainScreen = () => {
  const { t } = useTranslation("main_screen");
  const classes = useStyles();

  return (
    <>
      <Container>
        <Box className={classes.justifyCenter}>
          <Box mt={6} className={classes.textBox}>
            <Typography align='center'>{t("description")}</Typography>
          </Box>
        </Box>
        <Box mt={6}>
          <Grid container className={classes.justifyCenter}>
            {
              items.map((item) => (
                <Grid key={item.id} item xs={12} md={6} lg={4} className={classes.justifyCenter}>
                  <InfoCard {...item} />
                </Grid>
              ))
            }
          </Grid>
        </Box>
        <Box mt={6}>
          <Grid container>
            <Grid item xs={12} lg={5} mb={2} className={classes.alignCenter}>
              <Box pr={5} py={5} className={classes.textBox}>
                <Typography gutterBottom variant="h4">{t("left_block_title")}</Typography>
                <Typography>{t("left-block-text")}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} lg={7}>
              <Box className={classes.justifyCenter}>
                <CardMedia className={classes.cardMedia} image="http://source.unsplash.com/random" />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Box mt={6} py={6} className={classes.grayBackground}>
        <Container>
          <Grid container>
            <Grid item xs={12} lg={7}>
              <Box className={classes.justifyCenter}>
                <CardMedia className={classes.cardMedia} image="http://source.unsplash.com/random" />
              </Box>
            </Grid>
            <Grid item xs={12} lg={5} className={classes.alignCenter}>
              <Box pl={5} py={5} color='text.primary' className={classes.textBox}>
                <Typography gutterBottom variant="h4">{t("left_block_title")}</Typography>
                <Typography>{t("left_block_text")}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Container>
        <Box mt={6} mb={5}>
          <Grid container className={classes.justifyCenter}>
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
    </>
  );
};

export default MainScreen;