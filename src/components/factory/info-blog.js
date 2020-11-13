import { Box, IconButton, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() => ({
  cardDescription: {
    margin: '20px',
    width: '370px',
    display: 'flex',
    flexDirection: 'column'
  },
  justifyCenter: {
    display: 'flex',
    justifyContent: 'center'
  }
}));


const Child = ({icon, title, text}) => {
  const classes = useStyles();

  return (
    <Box className={classes.cardDescription}>
      <Box mb={3} className={classes.justifyCenter}>
        {/* надо передавать картинки или svg, это вариант примерный иконка крыво отрисовуется и должна быть зарание имрортированой */}
        <IconButton color='secondary' component={icon} />
      </Box>
      <Typography align='center' gutterBottom variant="h6">{title}</Typography>
      <Typography align='center'>{text}</Typography>
    </Box>
  );
};

export default Child;
