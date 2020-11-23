import { Box, CardMedia, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';


const useStyles = makeStyles(() => ({
  justifyCenter: {
    display: 'flex',
    justifyContent: 'center'
  },
  cardMedia: {
    width: '370px',
    height: '250px',
    borderRadius: '8px'
  }
}));


function EventCard({img, url, title, text}) {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={12} md={5} lg={4}>
        <RouterLink to={url}>
          <Box className={classes.justifyCenter}>
            <CardMedia className={classes.cardMedia} image={img} />
          </Box>
        </RouterLink>
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <Box my={2}>
          <RouterLink to={url}>
            <Typography variant="h6" gutterBottom>{title}</Typography>
          </RouterLink>
          <Typography>{text}</Typography>
        </Box>
      </Grid>
    </Grid>  
  );
}

export default EventCard;