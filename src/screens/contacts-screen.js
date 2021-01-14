import { Box, Button, Checkbox, Container, FormControlLabel, Grid, makeStyles, Paper, TextareaAutosize, TextField, Typography, useMediaQuery } from '@material-ui/core';
import { PhoneTwoTone, PinDrop } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({

  imgContainer: {
    backgroundImage: `url(${process.env.CONTACT_US})`,
    minHeight: '900px'
  },
  leftBlock: {
    maxWidth: '450px'
  },
  rightBlock: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  paper: {
    marginTop: '80px',
    marginBottom: '40px',
    padding: '30px',
    maxWidth: '450px'
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
  displayFlex: {
    display: 'flex'
  },
  imputFirstName: {
    paddingRight: '10px'
  },
  imputLastName: {
    paddingLeft: '10px'
  }
}));

function ContactsScreen() {
  const { t } = useTranslation("contacts_screen");
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.up('sm'));
  let textAreaWidth = {width: "270px" };
  if ( matches ) textAreaWidth = {width: "390px" };

  return (
    <Box className={classes.imgContainer}>
      <Container>
        <Grid container>
          <Grid item xs={12} md={6} lg={5}>
            <Box mt={10} className={classes.leftBlock} color='primary.contrastText'>
              <Typography variant="h3" component="h2">{t("title")}</Typography>
              <Typography>{t("description")}</Typography>
            </Box>
            <Box mt={4} color='primary.contrastText'>
              <Box className={classes.displayFlex}>
                <Box mr={2} color='primary.contrastText'>
                  <PinDrop />
                </Box>
                <Typography variant="h5">{t("find_us_in_office")}</Typography>
              </Box>
              <Typography>{t("address")}</Typography>
            </Box>
            <Box mt={4} color='primary.contrastText'>
              <Box className={classes.displayFlex}>
                <Box mr={2} color='primary.contrastText'>
                  <PhoneTwoTone />
                </Box>
                <Typography variant="h5">{t("give_us_ring")}</Typography>
              </Box>
              <Typography>{t("telephone")}</Typography>
            </Box>
          </Grid>
          <Grid item lg={2}></Grid>
          <Grid item xs={12} md={6} lg={5}>
            <Paper className={classes.paper}>
              <Box className={classes.headerBox} >
                <Typography align='center' variant="h6" className={classes.headerBoxTitle} >{t("contact_us")}</Typography>
              </Box>
              <Grid container justify='space-between'>
                <Grid item xs={12} sm={6} className={matches ? classes.imputFirstName : ''}>
                  <TextField autoFocus margin="dense" id="firstName" label="First name" type="firstName" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} className={matches ? classes.imputLastName : ''}>
                  <TextField autoFocus margin="dense" id="lastName" label="Last name" type="lastName" fullWidth />
                </Grid>
              </Grid>
              <TextField autoFocus margin="dense" id="EmailAddress" label="Email address" type="EmailAddress" fullWidth />
              <Box mt={4}>
                <TextareaAutosize rows={8} rowsMax={8} style={textAreaWidth} />
              </Box>
              <Box mt={4}>
                <Grid container justify='space-between'>
                  <Grid item>
                    <Box mb={2}>
                      <FormControlLabel control={<Checkbox name="checked" />} label={t("no_robot")} />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Button variant='contained' color="primary">{t("send_message")}</Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ContactsScreen;