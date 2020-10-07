import React from "react";
import { makeStyles, Box } from "@material-ui/core";

import ItemOfCalendar from "./item-of-calendar";

const useCardStyles = makeStyles((theme) => (
  {
    cardContent: {
      "&:last-child": {
        paddingBottom: theme.spacing(0)
      },
      padding: theme.spacing(0),
    },
    date: {
      margin: theme.spacing(1),
    },
    node: {
      display: "flex",
      justifyContent: "flex-start",
      width: "100%",
      overflow: "hidden",
      padding: theme.spacing("5px", "5px"),
      marginTop: theme.spacing(1)
    },
    time: {
      fontWeight: 700,
    },
    label: {
      marginLeft: "auto",
      paddingLeft: theme.spacing(1),
    }
  }
));


function CardOfTime({ disabled, events }) {
  const classes = useCardStyles();
  return (
    <Box className={classes.cardContent}>
      {events.map(({_id, ...rest}) => (
        <ItemOfCalendar key={_id} disabled={disabled} {...rest} />
      ))}
    </Box>
  );
}

export default CardOfTime;