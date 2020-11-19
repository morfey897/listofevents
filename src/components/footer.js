import { Button, Container, Grid, Typography, Link, Box, makeStyles } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Accessibility } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { SCREENS } from "../enums";


const useStyles = makeStyles(() => ({
  linksStyle: {
    color: 'gray',
    paddingTop: '5px',
  }
}));

const Footer = () => {
  const {t} = useTranslation("footer_block");
  const classes = useStyles();

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
            <Box m={2}>
              <Typography>{t("community")}</Typography>
              <Link href="https://www.facebook.com/">
                <Typography className={classes.linksStyle}>FaceBook</Typography>
              </Link>
              <Link href="https://www.instagram.com">
                <Typography className={classes.linksStyle}>Instagram</Typography>
              </Link>
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
                <Typography className={classes.linksStyle}>{t("about_screen")}</Typography>
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