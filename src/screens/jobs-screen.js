import { Box, Button, Container, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6)
  },
  justifyCenter: {
    display: 'flex',
    justifyContent: 'center'
  }
}));


const JobsScreen = () => {
  const { t } = useTranslation("jobs");
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Box mt={6}>
        <Typography variant="h2" align="center">{t("title")}</Typography>
      </Box>
      <Box mt={5} px={15}>
        <Typography align="center">{t("description")}</Typography>
      </Box>
      <Box mt={8} px={15}>
        <Grid container>
          <Grid item xs={12} md={6} lg={4}>
            <Box className={classes.justifyCenter}>
              <TextField autoFocus margin="dense" id="firstName" label="Your name" type="yourName" />
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Box className={classes.justifyCenter}>
              <TextField margin="dense" id="yourPhone" label="Your phone" type="yourPhone" />
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Box className={classes.justifyCenter}>
              <TextField margin="dense" id="yourEmail" label="Your email" type="yourEmail" />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box mt={5} className={classes.justifyCenter}>
        <Button variant='contained' color="primary">{t("letsTalk")}</Button>
      </Box>
    </Container>

  );
};

export default JobsScreen;