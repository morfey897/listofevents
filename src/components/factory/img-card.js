import { Box, CardMedia, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() => ({
  card: {
    margin: '20px',
    display: 'flex',
    justifyContent: 'center'
  },
  cardMedia: {
    width: '295px',
    height: '395px',
    borderRadius: '8px'
  }
}));


const Child = ({url}) => {
  const classes = useStyles();

  return (
    <Box className={classes.card}>
      <CardMedia className={classes.cardMedia} image={url} />
    </Box>
  );
};

export default Child;