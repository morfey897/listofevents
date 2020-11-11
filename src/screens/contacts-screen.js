import { Box, Button, Checkbox, Container, FormControlLabel, Grid, makeStyles, Paper, TextareaAutosize, TextField, Typography } from '@material-ui/core';
import { PhoneTwoTone, PinDropTwoTone } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  containerImg: {
    backgroundImage: 'url(http://source.unsplash.com/random)',
    height: '600px'
  },
  text: {
    color: 'white'
  },
  rightBlock: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  whitePaper: {
    marginTop: '80px',
    padding: '30px',
    width: '450px',
    height: '450px'
  },
  purpleBox: {
    position: 'relative',
    top: '-40px',
    backgroundColor: '#3f51b5',
    height: '50px',
    borderRadius: '5px'
  },
  purpleBoxText: {
    paddingTop: '8px',
    color: 'white'
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
      <Container my={0} className={classes.containerImg}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Box mt={12}>
              <Typography variant="h3" component="h2" className={classes.text}>{t("title")}</Typography>
              <Typography className={classes.text}>{t("description")}</Typography>
            </Box>
            <Box mt={4}>
              <Box className={classes.displayFlex}>
                <Box mr={2}>
                  <PinDropTwoTone />
                </Box>
                <Typography variant="h5" className={classes.text}>{t("find_us_in_office")}</Typography>
              </Box>
              <Typography className={classes.text}>{t("address")}</Typography>
            </Box>
            <Box mt={4}>
              <Box className={classes.displayFlex}>
                <Box mr={2}>
                  <PhoneTwoTone/>
                </Box>
                <Typography variant="h5" className={classes.text}>{t("give_us_ring")}</Typography>
              </Box>
              <Typography className={classes.text}>{t("telephone")}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} className={classes.rightBlock}>
            <Paper className={classes.whitePaper}>
              <Box className={classes.purpleBox}  >
                <Typography align='center' variant="h6" className={classes.purpleBoxText} >{t("contact_us")}</Typography>
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
    </>
  );
}

export default ContactsScreen;