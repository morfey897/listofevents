import { Button, Container, Grid, Typography, Box, makeStyles } from '@material-ui/core';
import React, { useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Accessibility } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { SCREENS } from "../enums";


const useStyles = makeStyles(() => ({
  linksStyle: {
    color: 'gray',
    paddingTop: '5px',
  },
  buttonStyle: {
    textTransform: 'none',
    justifyContent: 'start'
  },
  column: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

const Footer = () => {
  const {t} = useTranslation("footer_block");
  const classes = useStyles();

  const onClickFacebookLink = useCallback(() => {
    window.open('https://www.facebook.com/');
  }, []);

  const onClickInstaLink = useCallback(() => {
    window.open('https://www.instagram.com');
  }, []);

  return (
    <Container>
      <Box mt={5} mb={4} mx={6}>
        <Grid container spacing={1}>
          <Grid item xs={6} md={3}>
            <Box m={2}>
              <Button startIcon={<Accessibility/>} color="primary">Dance school</Button>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box m={2} className={classes.column}>
              <Box ml={1}>
                <Typography>{t("community")}</Typography>
              </Box>
              <Button onClick={onClickFacebookLink} className={classes.buttonStyle}>FaceBook</Button>
              <Button onClick={onClickInstaLink} className={classes.buttonStyle}>Instagram</Button>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box m={2}>
              <Typography>{t("resources")}</Typography>
              <Typography className={classes.linksStyle}>{t("support")}</Typography>
              <Typography className={classes.linksStyle}>{t("blog")}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box m={2}>
              <Typography>{t("company")}</Typography>
              <RouterLink to={SCREENS.ABOUT}>
                <Typography className={classes.linksStyle}>{t("about")}</Typography>
              </RouterLink>
              <RouterLink to={SCREENS.CONTACTS}>
                <Typography className={classes.linksStyle}>{t("contact_us")}</Typography>
              </RouterLink>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};


export default Footer;