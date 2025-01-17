import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, FormControlLabel, Grid, LinearProgress, Radio, RadioGroup, Typography, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import { fetchUsersActionCreator, updateUserActionCreator, deleteUsersActionCreator } from "../model/actions";
import { bindActionCreators } from "redux";
import { STATUSES } from "../enums";

import {
  Delete as DeleteIcon,
} from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  grid: {
    overflowWrap: "anywhere",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
  },

  right: {
    textAlign: "right"
  },

  center: {
    textAlign: "center"
  }
}));

function UsersListDialog({ open, handleClose, isModerator, isSuperAdmin, userRole, isLoading, updating, roles, users, fetchUsers, updateUser, deleteUser }) {

  const { t } = useTranslation(["users_list_dialog", "general"]);

  const classes = useStyles();
  const fullScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

  useEffect(() => {
    if (isModerator) {
      fetchUsers();
    }
  }, [isModerator]);

  return <Dialog open={open} onClose={handleClose} scroll={"paper"} fullScreen={fullScreen} fullWidth={true} maxWidth={"sm"}>
    <DialogTitle disableTypography={!fullScreen} className={fullScreen ? "" : "boxes"}>
      {fullScreen ?
        <>
          {t("title")}
          {(isLoading) && <LinearProgress />}
        </> :
        <Box className={classes.dialogTitle} >
          <Typography align='center' variant="h6" >{t("title")}</Typography>
          {(isLoading) && <LinearProgress />}
        </Box>
      }
    </DialogTitle>
    <DialogContent dividers={true}>
      <DialogContentText>
        {isLoading && t("loading_list")}
        {!isLoading && users.length == 0 && t("empty_list")}
      </DialogContentText>
      {
        !isLoading && users.length != 0 &&
        <Grid container spacing={1} className={classes.grid}>
          <Grid item xs={3}>{t("header_name")}</Grid>
          <Grid item xs={3} className={classes.center}>{t("header_phone")}</Grid>
          <Grid item xs={3} className={classes.center}>{t("header_email")}</Grid>
          <Grid item xs={3} className={classes.right}>{t("header_role")}</Grid>
        </Grid>
      }
      {!isLoading && users.map(({ _id, name, surname, email, phone, role: lRole }) => {
        return <Grid key={_id} container spacing={1} className={classes.grid} alignItems="center">
          <Grid item xs={3}>
            {isSuperAdmin && [name, surname].filter(a => a).join(" ") || t("empty_field")}
            {
              isSuperAdmin && <Button onClick={() => deleteUser(_id)}>
                <DeleteIcon />
              </Button>
            }
          </Grid>
          <Grid item xs={3} className={classes.center}>{phone || t("empty_field")}</Grid>
          <Grid item xs={3} className={classes.center}>{email || t("empty_field")}</Grid>
          <Grid item xs={3} className={classes.right}>
            <RadioGroup value={lRole} onChange={(event) => updateUser(_id, parseInt(event.target.value))}>
              {roles.map(({ name, role }) => {
                if (role > userRole) return null;
                return <FormControlLabel disabled={isLoading && updating.indexOf(_id) != -1} key={`${_id}:${role}`} value={role} labelPlacement="start" label={name} control={<Radio size="small" color="primary" />} />;
              })}
            </RadioGroup>
          </Grid>
        </Grid>;
      })}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">{t("general:button_close")}</Button>
    </DialogActions>
  </Dialog>;
}

const mapStateToProps = (state) => {
  const { user, config, users } = state;

  const roles = [];
  for (let name in config.roles) {
    if (name != "guest") {
      roles.push({ name, role: config.roles[name] });
    }
  }
  roles.sort((a, b) => a.role - b.role).forEach((a, index, array) => {
    if (index > 0) {
      a.role += array[index - 1].role;
    }
  });

  let usersList = users.list.filter(({ _id }) => user.user._id !== _id);
  return {
    isLogged: user.isLogged,
    isModerator: user.isLogged && (user.user.role & config.roles.moderator) === config.roles.moderator,
    isSuperAdmin: user.isLogged && (user.user.role & config.roles.super_admin) === config.roles.super_admin,
    userRole: user.isLogged && user.user.role || 0,

    isLoading: users.status === STATUSES.STATUS_PENDING || config.status === STATUSES.STATUS_PENDING,
    users: usersList,
    updating: users.updating,

    roles,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchUsers: fetchUsersActionCreator,
  updateUser: updateUserActionCreator,
  deleteUser: deleteUsersActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UsersListDialog);