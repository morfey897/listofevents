import { Box, Button, Checkbox, Container, FormControlLabel, Grid, makeStyles, Paper, TextareaAutosize, TextField, Typography } from '@material-ui/core';
import { PhoneTwoTone, PinDrop } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../components/footer';

const useStyles = makeStyles((theme) => ({
  containerImg: {
    backgroundImage: 'url(http://source.unsplash.com/random)',
    height: '700px'
  },
  rightBlock: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  paper: {
    marginTop: '80px',
    padding: '30px',
    width: '450px',
    height: '450px'
  },
  headerBox: {
    position: 'relative',
    top: '-40px',
    backgroundColor: theme.palette.info.main,
    height: '50px',
    borderRadius: '5px'
  },
  headerBoxTitle: {
    paddingTop: '8px',
    color: theme.palette.info.contrastText
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  displayFlex: {
    display: 'flex'
  }
}));

function ContactsScreen() {
  const {t} = useTranslation("contacts");
  const classes = useStyles();

  return (
    <>
      <Box className={classes.containerImg}>
        <Container>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Box mt={12} color='common.white'>
                <Typography variant="h3" component="h2">{t("title")}</Typography>
                <Typography>{t("description")}</Typography>
              </Box>
              <Box mt={4} color='common.white'>
                <Box className={classes.displayFlex}>
                  <Box mr={2} color='common.white'>
                    <PinDrop />
                  </Box>
                  <Typography variant="h5" color='common.white'>{t("find_us_in_office")}</Typography>
                </Box>
                <Typography>{t("address")}</Typography>
              </Box>
              <Box mt={4} color='common.white'>
                <Box className={classes.displayFlex}>
                  <Box mr={2} color='common.white'>
                    <PhoneTwoTone />
                  </Box>
                  <Typography variant="h5">{t("give_us_ring")}</Typography>
                </Box>
                <Typography>{t("telephone")}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} className={classes.rightBlock}>
              <Paper className={classes.paper}>
                <Box className={classes.headerBox} >
                  <Typography align='center' variant="h6" className={classes.headerBoxTitle} >{t("contact_us")}</Typography>
                </Box>
                <Box className={classes.spaceBetween}>
                  <TextField autoFocus margin="dense" id="firstName" label="First name" type="firstName" />
                  <TextField autoFocus margin="dense" id="lastName" label="Last name" type="lastName" />
                </Box>
                <TextField autoFocus margin="dense" id="EmailAddress" label="Email address" type="EmailAddress" fullWidth />
                <Box mt={4}>
                  <TextareaAutosize rows={8} rowsMax={8} style={{width: "390px"}} />
                </Box>
                <Box mt={4} className={classes.spaceBetween}>
                  <FormControlLabel control={<Checkbox name="checked" />} label={t("no_robot")} />
                  <Button variant='contained' color="primary">{t("send_message")}</Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer/>
    </>
  );
}

export default ContactsScreen;