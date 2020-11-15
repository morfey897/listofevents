import { Box, Container, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import Factory from '../components/factory';
import Footer from '../components/footer';
import LineSeparator from '../components/separators';
import { LATEST_BLOG, IMG_CARD } from '../enums/factory';

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
const eventTitle = 'The Castle Looks Different at Night...';
const eventText = `This is the paragraph where you can write more details about your product. Keep you user engaged by providing meaningful information. Remember that by this time, the user is curious, otherwise he wouldn\'t scroll to get here. Add a button if you want the user to see more. We are here to make life better.And now I look and look around and there’s so many Kanyes I\'ve been trying to figure out the bed design for the master bedroom at our Hidden Hills compound... and thank you for turning my personal jean jacket into a couture piece. /n This is the paragraph where you can write more details about your product. Keep you user engaged by providing meaningful information. Remember that by this time, the user is curious, otherwise he wouldn\'t scroll to get here. Add a button if you want the user to see more. We are here to make life better.And now I look and look around and there’s so many Kanyes I\'ve been trying to figure out the bed design for the master bedroom at our Hidden Hills compound... and thank you for turning my personal jean jacket into a couture piece.`;
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

const useStyles = makeStyles(() => ({
  text: {
    fontSize: '22px',
    lineHeight: '30px'
  }
}));

const EventScreen = () => {
  const classes = useStyles();

  return (
    <>
      <Container>
        <Box mt={4} px={18}>
          <Typography variant="h4" gutterBottom>{eventTitle}</Typography>
          <Typography className={classes.text}>{eventText}</Typography>
        </Box>
        <Box>
          <Grid container>
            {
              photoArr.map((item, i) => (
                <Grid key={i} item xs={12} md={6} lg={4}>
                  <Factory type={IMG_CARD} props={item} />
                </Grid>
              ))
            }
          </Grid>
        </Box>
        <Box mt={4} px={18}>
          <Typography variant="h4" gutterBottom>{eventTitle}</Typography>
          <Typography className={classes.text}>{eventText}</Typography>
        </Box>
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

export default EventScreen;