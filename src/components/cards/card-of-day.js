import { Typography, Card, CardContent } from "@material-ui/core";
import { makeStyles} from "@material-ui/core/styles";
import { format } from 'date-fns';
import { indigo } from '@material-ui/core/colors';

import ItemOfCalendar from "./item-of-calendar";

const useCardStyles = makeStyles((theme) => ({
  cardContent: {
    "&:last-child": {
      paddingBottom: theme.spacing(0)
    },
    padding: theme.spacing(0),
  },
  date: {
    margin: theme.spacing(1),
  },
  nowCard: {
    backgroundColor: indigo[100],
  },
}));

function CardOfDay({ date, disabled, events }) {
  const classes = useCardStyles();

  return (
    <Card elevation={events.length ? 1 : 0} square>
      <CardContent className={classes.cardContent}>
        <Typography align="right" color={disabled ? "textSecondary" : "textPrimary"}>
          {format(date, 'dd')}
        </Typography>
        {events.map((data) => (
          <ItemOfCalendar key={data._id} disabled={disabled} {...data} />
        ))}
      </CardContent>
    </Card>
  );
}

export default CardOfDay;