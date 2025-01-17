import { Box, CardMedia } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";

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


function ImgCard({ url }) {
  const classes = useStyles();

  return (
    <Box className={classes.card}>
      <CardMedia className={classes.cardMedia} image={url} />
    </Box>
  );
}

export default ImgCard;