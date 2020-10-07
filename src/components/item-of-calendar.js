import React, { useMemo } from 'react';
import { makeStyles, ButtonBase, withTheme } from "@material-ui/core";
import { format } from 'date-fns';
import { PAST } from '../static/tense';
import { capitalCaseTransform as capitalCase } from 'change-case';


const useStyles = makeStyles((theme) => {
  return  {
    node: {
      display: "flex",
      justifyContent: "flex-start",
      width: "100%",
      overflow: "hidden",
      padding: theme.spacing("5px", "5px"),
      margin: theme.spacing("2px", "1px"),
      "&:last-child": {
        marginBottom: theme.spacing(0)
      }
    },
    time: {
      fontWeight: 700,
    },
    label: {
      marginLeft: "auto",
      paddingLeft: theme.spacing(1),
    },
    // ...theme.getColors()
  };
});

function ItemOfCalendar({ date, label, disabled, colorClass}) {
  const classes = useStyles();
  return (
    <ButtonBase className={`${colorClass || ""} ${classes.node}`}>
      <div className={classes.time}>
        {format(date, "HH:mm")}
      </div>
      <div className={classes.label}>
        {capitalCase(label)}
      </div>
    </ButtonBase>
  );
}

export default ItemOfCalendar;
