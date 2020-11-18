import { Box, CardMedia, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() => ({
  card: {
    margin: '20px',
    width: '370px',
    display: 'flex',
    flexDirection: 'column'
  },
  cardMedia: {
    marginTop: '20px',
    width: '370px',
    height: '250px',
    borderRadius: '8px'
  }
}));


function LatestCard({img, title, text}) {
  const classes = useStyles();

  return (
    <Box className={classes.card}>
      <CardMedia className={classes.cardMedia} image={img} />
      <Box mt={2}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
      </Box>
      <Typography>{text}</Typography>
    </Box>
  );
}

export default LatestCard;