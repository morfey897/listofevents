import { Box, Card, CardContent, CardMedia, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Facebook, LocalSee, Telegram } from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles(() => ({
  card: {
    width: '280px',
    height: '420px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  cardMedia: {
    marginTop: '20px',
    width: '130px',
    height: '130px',
    borderRadius: '50%'
  }
}));


function PersonCard({firstName, lastName, profesion, aboutMe}) {
  const classes = useStyles();

  return (
    <Card className={classes.card}> 
      <CardMedia className={classes.cardMedia} image="http://source.unsplash.com/random" />
      <CardContent>
        <Typography variant="h5" align='center' gutterBottom>{firstName + ' ' + lastName}</Typography>
        <Typography variant="subtitle1" align='center' gutterBottom>{profesion}</Typography>
        <Typography align='center'>{aboutMe}</Typography>
      </CardContent>
      <Box>
        <IconButton color='primary'>
          <Facebook />
        </IconButton>
        <IconButton color='secondary'>
          <LocalSee/>
        </IconButton>
        <IconButton color='primary'>
          <Telegram />
        </IconButton>
      </Box>
    </Card>
  );
}

export default PersonCard;