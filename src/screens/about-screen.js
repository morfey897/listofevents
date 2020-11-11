import { Box, Card, CardActions, CardContent, CardMedia, Container, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Facebook, LocalSee, Telegram } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../components/footer';
import LineSeparator from '../components/separators';

let administrations = [
  {
    id: 1,
    firstName: 'Alec',
    lastName: 'Thompson',
    profesion: 'CEO / CO-FOUNDER',
    aboutMe: 'And I love you like Kanye loves Kanye. We need to restart the human foundation.'
  },
  {
    id: 2,
    firstName: 'Tania',
    lastName: 'Andrew',
    profesion: 'DESIGNER',
    aboutMe: 'Don\'t be scared of the truth because we need to restart the human foundation. And I love you like Kanye loves Kanye.'
  },
  {
    id: 3,
    firstName: 'Christian',
    lastName: 'Mike',
    profesion: 'WEB DEVELOPER',
    aboutMe: 'I love you like Kanye loves Kanye. Don\'t be scared of the truth because we need to restart the human foundation.'
  },
  {
    id: 4,
    firstName: 'Rebecca',
    lastName: 'Stormvile',
    profesion: 'WEB DEVELOPER',
    aboutMe: 'And I love you like Kanye loves Kanye. We really need to restart the human foundation.'
  }
];


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

function AboutScreen() {
  const {t} = useTranslation("about");
  const classes = useStyles();

  return (
    <>
      <Container>
        <Box mt={8}>
          <Typography variant="h2" align="center">{t("title")}</Typography>
        </Box>
        <Box mt={5}>
          <Typography fontWeight="fontWeightBold" align="center">{t("description")}</Typography>
        </Box>
        <Box mt={5}>
          <Grid container spacing={4}>
            {
              administrations.map(({id, firstName, lastName, profesion, aboutMe}) => (
                <Grid item key={id} xs={12} sm={6} md={4} lg={3}>
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
                </Grid>
              ))
            }
          </Grid>
        </Box>
        <Box mt={12}>
          <Typography variant="h2" align="center">{t("title_2")}</Typography>
        </Box>
        <Box mt={5}>
          <Typography fontWeight="fontWeightBold" align="center">{t("description_2")}</Typography>
        </Box>
      </Container>
      <Box mt={5}>
        <LineSeparator/>
      </Box>
      <Footer/>
    </>
  );
}

export default AboutScreen;
