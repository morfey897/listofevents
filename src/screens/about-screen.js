import { Box, Button, Container, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { Build, Create, Gesture } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PersonCard } from '../components/cards';

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


const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6)
  },

  cardDescription: {
    margin: '20px',
    width: '370px',
    display: 'flex'
  },

  justifyCenter: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

function AboutScreen() {
  const { t } = useTranslation("about_screen");
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Box mt={8}>
        <Typography variant="h2" align="center">{t("title")}</Typography>
      </Box>
      <Box mt={5}>
        <Typography align="center">{t("description")}</Typography>
      </Box>
      <Box mt={5}>
        <Grid container spacing={4}>
          {
            administrations.map((item) => (
              <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                <PersonCard {...item} />
              </Grid>
            ))
          }
        </Grid>
      </Box>
      <Box mt={12}>
        <Typography variant="h2" align="center">{t("title_2")}</Typography>
      </Box>
      <Box mt={5}>
        <Typography align="center">{t("description_2")}</Typography>
      </Box>
      <Box mt={12}>
        <Grid container>
          <Grid item xs={12} md={6} lg={4}>
            <Box className={classes.cardDescription}>
              <Box mx={2}>
                <Gesture color='secondary' />
              </Box>
              <Box>
                <Typography variant="h6">{`1. ${t("design")}`}</Typography>
                <Typography>{t("design_description")}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Box className={classes.cardDescription}>
              <Box mx={2}>
                <Build color='secondary' />
              </Box>
              <Box>
                <Typography variant="h6">{`2. ${t("develop")}`}</Typography>
                <Typography>{t("develop_description")}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Box className={classes.cardDescription}>
              <Box mx={2}>
                <Create color='secondary' />
              </Box>
              <Box>
                <Typography variant="h6">{`3. ${t("make_edits")}`}</Typography>
                <Typography>{t("make_edits_description")}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box mt={6}>
        <Typography variant="h2" align="center">{t("partnership-title")}</Typography>
      </Box>
      <Box mt={5} px={15}>
        <Typography align="center">{t("partnership-description")}</Typography>
      </Box>
      <Box mt={8} px={15}>
        <Grid container>
          <Grid item xs={12} md={6} lg={4}>
            <Box className={classes.justifyCenter}>
              <TextField autoFocus margin="dense" label="Your name" type="yourName" />
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Box className={classes.justifyCenter}>
              <TextField margin="dense" label="Your phone" type="yourPhone" />
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Box className={classes.justifyCenter}>
              <TextField margin="dense" label="Your email" type="yourEmail" />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box mt={5} className={classes.justifyCenter}>
        <Button variant='contained' color="primary">{t("partnership-letsTalk")}</Button>
      </Box>
    </Container>
  );
}

export default AboutScreen;
