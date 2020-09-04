import React from 'react';
import { makeStyles, ButtonBase } from "@material-ui/core";
import { format } from 'date-fns';

const useStyles = makeStyles((theme) => {
  const colors = {};
  ["set", "disable"].map(sub => {
    let i = 0;
    do {
      let name = `color_${sub}_${i}`;
      let p = theme.palette[name];
      if (!p) break;
      colors[name] = {
        backgroundColor: p.main,
        color: p.contrastText
      };
      i++;
      // eslint-disable-next-line no-constant-condition
    } while(true);
  });
  
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
      },
    },
    time: {
      fontWeight: 700,
    },
    label: {
      marginLeft: "auto",
      paddingLeft: theme.spacing(1),
    },
    ...colors
  };
});

function CalendarItem({ date, city, category, description, placeName, placeLat, placeLon, disable, colorIndex}) {
  const classes = useStyles();

  return (
    <ButtonBase className={`${classes.node} ${classes[`color_${disable ? "disable" : "set"}_${colorIndex}`]}`}>
      <div className={classes.time}>
        {format(date, "HH:mm")}
      </div>
      <div className={classes.label}>
        {city}
      </div>
    </ButtonBase>
  );
}

export default CalendarItem;
