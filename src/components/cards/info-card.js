import { Box, IconButton, makeStyles, Typography } from '@material-ui/core';
import { ViewComfy, ViewDay, ViewCarousel } from '@material-ui/icons';

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


function InfoCard({ icon, title, text }) {
  const classes = useStyles();

  return (
    <Box className={classes.cardDescription}>
      <Box mb={3} className={classes.justifyCenter}>
        {/* надо передавать картинки или svg, это вариант примерный иконка крыво отрисовуется и должна быть зарание имрортированой */}
        <IconButton color='secondary'>
          {icon === "ViewComfy" && <ViewComfy />}
          {icon === "ViewDay" && <ViewDay />}
          {icon === "ViewCarousel" && <ViewCarousel />}
        </IconButton>
      </Box>
      <Typography align='center' gutterBottom variant="h6">{title}</Typography>
      <Typography align='center'>{text}</Typography>
    </Box>
  );
}

export default InfoCard;
