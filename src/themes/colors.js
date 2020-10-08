import { teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, blueGrey } from '@material-ui/core/colors';
import { FUTURE, PAST, PRESENT } from '../static/tense';

const colors = [

  {[FUTURE]: {
    main: lightGreen[900],
    contrastText: "#fff",
  }, [PAST]: {
    main: lightGreen[100],
    contrastText: "#000000DE",
  }},

  // {[FUTURE]: {
  //   main: lime[900],
  //   contrastText: "#fff",
  // }, [PAST]: {
  //   main: lime[100],
  //   contrastText: "#000000DE",
  // }},

  {[FUTURE]: {
    main: yellow[900],
    contrastText: "#000000DE",
  }, [PAST]: {
    main: yellow[100],
    contrastText: "#000000DE",
  }},

  // {[FUTURE]: {
  //   main: amber[900],
  //   contrastText: "#000000DE",
  // }, [PAST]: {
  //   main: amber[100],
  //   contrastText: "#000000DE",
  // }},

  {[FUTURE]: {
    main: orange[900],
    contrastText: "#fff",
  }, [PAST]: {
    main: orange[100],
    contrastText: "#000000DE",
  }},

  {[FUTURE]: {
    main: deepOrange[900],
    contrastText: "#fff",
  }, [PAST]: {
    main: deepOrange[100],
    contrastText: "#000000DE",
  }},

  {[FUTURE]: {
    main: teal[900],
    contrastText: "#fff",
  }, [PAST]: {
    main: teal[100],
    contrastText: "#000000DE",
  }},

  {[FUTURE]: {
    main: green[900],
    contrastText: "#fff",
  }, [PAST]: {
    main: green[100],
    contrastText: "#000000DE",
  }},

  {[FUTURE]: {
    main: brown[900],
    contrastText: "#fff",
  }, [PAST]: {
    main: brown[100],
    contrastText: "#000000DE",
  }},

  {[FUTURE]: {
    main: blueGrey[900],
    contrastText: "#fff",
  }, [PAST]: {
    main: blueGrey[100],
    contrastText: "#000000DE",
  }},
];

export function getColorIndex(index) {
  if (index < 0 || isNaN(parseInt(index))) return colors.length - 1;
  return Math.min(index, colors.length - 2);
};

export default colors;