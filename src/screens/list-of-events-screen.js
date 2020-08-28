import React, { useEffect, useMemo } from 'react';
import { request } from '../api/graphQL';
import { filterEvents } from '../api/queries/event-query';
import { Header, Filter } from '../components';
import { Container, Typography, Grid } from '@material-ui/core';
import { makeStyles, CssBaseline } from '@material-ui/core';
import { Calendar } from '../components';

const useStyles = makeStyles((theme) => ({

}));


function ListOfEventsScreen() {
  const classes = useStyles();

  useEffect(() => {
    // request(filterEvents())
    //   .then(result => {
    //     console.log(result);
    //   });
  }, []);

  const cities = ["Kyiv", "Lviv", "Viniza", "Odessa", "Kharkiv"];
  const categories = ["MasterClass", "Concert", "Event"];

  const events = useMemo(() => {

    const result = [];
    const len = 30;
    
    for (let n = 0; n < len; n++) {
      let date = parseInt(Math.random()*30 + 1);
      let hh = parseInt(Math.random()*10 + 12);
      let mm = parseInt(Math.random()*11)*5;
      result.push({
        date: new Date(2020, 7, date, hh, mm/*   `2020-08-${date}T${hh}:${mm}:00Z`*/),
        country: "Ukraine", 
        city: cities[parseInt(Math.random()*cities.length)],
        category: categories[parseInt(Math.random()*categories.length)],
      });
    }

    console.log(result);
    return result;
  }, []);

  return (
    <>
    <Container>
      <Grid container>
        <Grid item>
          <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
            facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
            gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
            donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
            adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
            Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
            imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
            arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
            donec massa sapien faucibus et molestie ac.
        </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={9} lg={8} xl={7}>
          <Calendar date={new Date()} events={events} categories={categories} cities={cities} />
        </Grid>
      </Grid>
    </Container>
    {/* <Calendar minWidth={"600px"} date={new Date()} events={events} categories={categories} cities={cities} /> */}
</>
  );
}

export default ListOfEventsScreen;