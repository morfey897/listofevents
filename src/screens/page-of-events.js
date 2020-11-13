import { Box, Container } from '@material-ui/core';
import React from 'react';
import Factory from '../components/factory';
import Footer from '../components/footer';
import LineSeparator from '../components/separators';
import { EVENTS_CARD } from '../enums/factory';

const latestBlogs = [
  {
    id: 1,
    img: 'http://source.unsplash.com/random',
    title: 'Autodesk looks to future of 3D printing with Project Escher',
    text: 'Like so many organizations these days, Autodesk is a company in transition. It was until recently a traditional boxed software company selling licenses. Today, it’s moving to a subscription model. Yet its own business model disruption is only part of the story — and'
  },
  {
    id: 2,
    img: 'http://source.unsplash.com/random',
    title: 'Lyft launching cross-platform service this week',
    text: 'Like so many organizations these days, Autodesk is a company in transition. It was until recently a traditional boxed software company selling licenses. Today, it’s moving to a subscription model. Yet its own business model disruption is only part of the story — and'
  },
  {
    id: 3,
    img: 'http://source.unsplash.com/random',
    title: '6 insights into the French Fashion landscape',
    text: 'Like so many organizations these days, Autodesk is a company in transition. It was until recently a traditional boxed software company selling licenses. Today, it’s moving to a subscription model. Yet its own business model disruption is only part of the story — and'
  }
];

const PageOfEventsScreen = () => {

  return (
    <>
      <Container>
        <Box mt={6}>
          {
            latestBlogs.map((item) => (
              <Box key={item.id} my={4}>
                <Factory type={EVENTS_CARD} props={item} />
              </Box>
            ))
          }
        </Box>
      </Container>
      <Box mt={5}>
        <LineSeparator/>
      </Box>
      <Footer/>
    </>
  );
};

export default PageOfEventsScreen;