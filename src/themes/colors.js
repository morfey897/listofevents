import { teal, green, lightGreen, yellow, orange, deepOrange, brown, blueGrey } from '@material-ui/core/colors';
import { TENSE } from '../enums';

const colors = [

  {[TENSE.FUTURE]: {
    main: lightGreen[900],
    contrastText: "#fff",
  }, [TENSE.PAST]: {
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

  {[TENSE.FUTURE]: {
    main: yellow[900],
    contrastText: "#000000DE",
  }, [TENSE.PAST]: {
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

  {[TENSE.FUTURE]: {
    main: orange[900],
    contrastText: "#fff",
  }, [TENSE.PAST]: {
    main: orange[100],
    contrastText: "#000000DE",
  }},

  {[TENSE.FUTURE]: {
    main: deepOrange[900],
    contrastText: "#fff",
  }, [TENSE.PAST]: {
    main: deepOrange[100],
    contrastText: "#000000DE",
  }},

  {[TENSE.FUTURE]: {
    main: teal[900],
    contrastText: "#fff",
  }, [TENSE.PAST]: {
    main: teal[100],
    contrastText: "#000000DE",
  }},

  {[TENSE.FUTURE]: {
    main: green[900],
    contrastText: "#fff",
  }, [TENSE.PAST]: {
    main: green[100],
    contrastText: "#000000DE",
  }},

  {[TENSE.FUTURE]: {
    main: brown[900],
    contrastText: "#fff",
  }, [TENSE.PAST]: {
    main: brown[100],
    contrastText: "#000000DE",
  }},

  {[TENSE.FUTURE]: {
    main: blueGrey[900],
    contrastText: "#fff",
  }, [TENSE.PAST]: {
    main: blueGrey[100],
    contrastText: "#000000DE",
  }},
];

export function getColorIndex(index) {
  if (index < 0 || isNaN(parseInt(index))) return colors.length - 1;
  return Math.min(index, colors.length - 2);
}

export default colors;