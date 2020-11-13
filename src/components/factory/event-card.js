import { Box, CardMedia, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';


const useStyles = makeStyles(() => ({
  cardMedia: {
    width: '370px',
    height: '250px',
    borderRadius: '8px'
  }
}));


const Child = ({img, title, text}) => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={12} md={4}>
        <CardMedia className={classes.cardMedia} image={img} />
      </Grid>
      <Grid item xs={12} md={8}>
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>{title}</Typography>
          <Typography>{text}</Typography>
        </Box>
      </Grid>
    </Grid>  
  );
};

export default Child;