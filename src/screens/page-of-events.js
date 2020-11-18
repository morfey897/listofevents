import { Box, Container, makeStyles } from '@material-ui/core';
import React from 'react';
import { EventCard } from '../components/cards';

const latestBlogs = [
  {
    id: 1,
    img: 'http://source.unsplash.com/random',
    url: '/event-screen/n',
    title: 'Autodesk looks to future of 3D printing with Project Escher',
    text: 'Like so many organizations these days, Autodesk is a company in transition. It was until recently a traditional boxed software company selling licenses. Today, it’s moving to a subscription model. Yet its own business model disruption is only part of the story — and'
  },
  {
    id: 2,
    img: 'http://source.unsplash.com/random',
    url: '/event-screen/n',
    title: 'Lyft launching cross-platform service this week',
    text: 'Like so many organizations these days, Autodesk is a company in transition. It was until recently a traditional boxed software company selling licenses. Today, it’s moving to a subscription model. Yet its own business model disruption is only part of the story — and'
  },
  {
    id: 3,
    img: 'http://source.unsplash.com/random',
    url: '/event-screen/n',
    title: '6 insights into the French Fashion landscape',
    text: 'Like so many organizations these days, Autodesk is a company in transition. It was until recently a traditional boxed software company selling licenses. Today, it’s moving to a subscription model. Yet its own business model disruption is only part of the story — and'
  }
];

const useStyles = makeStyles((theme) => ({

  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6)
  },

}));

const PageOfEventsScreen = () => {

  const classes = useStyles();
  return (
    <Container className={classes.container}>
      <Box mt={6} >
        {
          latestBlogs.map((item) => (
            <Box key={item.id} my={4}>
              <EventCard {...item} />
            </Box>
          ))
        }
      </Box>
    </Container>
  );
};

export default PageOfEventsScreen;