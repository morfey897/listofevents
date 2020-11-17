import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  line: {
    color: theme.palette.grey["100"],
    margin: theme.spacing(0)
  }
}));

export function LineSeparator() {
  const classes = useStyles();
  return <hr className={classes.line} />;
}