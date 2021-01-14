import { Container, Grid, List, makeStyles, ListItem, ListItemIcon, ListItemText, Hidden } from '@material-ui/core';
import React, { useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SCREENS } from "../enums";

import {
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  TableChart as TableIcon,
  ViewDay as PageIcon,
  LabelImportant as AboutIcon,
  Forum as ContactsIcon,
  Policy as PolicyIcon
} from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({
  item1: {
    order: 1,
    [theme.breakpoints.down('sm')]: {
      order: 3,
    },
  },
  item2: {
    order: 2,
    [theme.breakpoints.down('sm')]: {
      order: 1,
    },
  },
  item3: {
    order: 3,
    [theme.breakpoints.down('sm')]: {
      order: 2,
    },
  },
  item4: {
    order: 4,
  },
}));


const Footer = () => {
  const { t } = useTranslation("footer_block");

  const classes = useStyles();

  const onClickFacebookLink = useCallback(() => {
    window.open('https://www.facebook.com/');
  }, []);

  const onClickInstaLink = useCallback(() => {
    window.open('https://www.instagram.com');
  }, []);

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item xs={6} md={3} className={classes.item1}>
          {/* <List>
            <ListItem button dense component={RouterLink} to={SCREENS.MAIN}>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary={process.env.APP_NAME} />
            </ListItem>
          </List> */}
        </Grid>
        <Grid item xs={6} md={3} className={classes.item2}>
          <List>
            <ListItem>
              <ListItemText primary={t("company")} />
            </ListItem>
            <ListItem button dense component={RouterLink} to={SCREENS.ABOUT}>
              <ListItemIcon>
                <AboutIcon />
              </ListItemIcon>
              <ListItemText primary={t("about")} />
            </ListItem>
            <ListItem button dense component={RouterLink} to={SCREENS.CONTACTS}>
              <ListItemIcon>
                <ContactsIcon />
              </ListItemIcon>
              <ListItemText primary={t("contact_us")} />
            </ListItem>
            <ListItem button dense component={RouterLink} to={SCREENS.PRIVACY_POLICY}>
              <ListItemIcon>
                <PolicyIcon />
              </ListItemIcon>
              <ListItemText primary={t("privacy_policy")} />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={6} md={3} className={classes.item3}>
          <List>
            <ListItem>
              <ListItemText primary={t("events")} />
            </ListItem>
            <ListItem button dense component={RouterLink} to={SCREENS.LIST_EVENTS}>
              <ListItemIcon>
                <TableIcon />
              </ListItemIcon>
              <ListItemText primary={t("list_events")} />
            </ListItem>
            <ListItem button dense component={RouterLink} to={SCREENS.PAGE_EVENTS}>
              <ListItemIcon>
                <PageIcon />
              </ListItemIcon>
              <ListItemText primary={t("page_events")} />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={6} md={3} className={classes.item4}>
          <List>
            <Hidden smDown>
              <ListItem>
                <ListItemText primary={t("community")} />
              </ListItem>
            </Hidden>
            <ListItem button dense onClick={onClickFacebookLink}>
              <ListItemIcon>
                <FacebookIcon />
              </ListItemIcon>
              <ListItemText primary={t("facebook")} />
            </ListItem>
            <ListItem button dense onClick={onClickInstaLink}>
              <ListItemIcon>
                <InstagramIcon />
              </ListItemIcon>
              <ListItemText primary={t("instagram")} />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Container>
  );
};


export default Footer;