import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  line: {
    color: theme.palette.grey["100"],
    margin: theme.spacing(0)
  }
}));

function LineSeparator() {
  const classes = useStyles();
  return <hr className={classes.line} />;
}

export default LineSeparator;