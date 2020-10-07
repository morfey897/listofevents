import { createMuiTheme } from '@material-ui/core/styles';
import { blue, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, blueGrey } from '@material-ui/core/colors';
import { FUTURE, PAST, PRESENT } from '../static/tense';

const future = [
  {
    main: blueGrey[900],
    contrastText: "#fff",
  },
  {
    main: teal[900],
    contrastText: "#fff",
  },
  {
    main: green[900],
    contrastText: "#fff",
  },
  {
    main: lightGreen[900],
    contrastText: "#fff",
  },
  {
    main: lime[900],
    contrastText: "#fff",
  },
  {
    main: yellow[900],
    contrastText: "#000000DE",
  },
  {
    main: amber[900],
    contrastText: "#000000DE",
  },
  {
    main: orange[900],
    contrastText: "#fff",
  },
  {
    main: deepOrange[900],
    contrastText: "#fff",
  },
  {
    main: brown[900],
    contrastText: "#fff",
  }
];

const past = [
  {
    main: blueGrey[100],
    contrastText: "#000000DE",
  },
  {
    main: teal[100],
    contrastText: "#000000DE",
  },
  {
    main: green[100],
    contrastText: "#000000DE",
  },
  {
    main: lightGreen[100],
    contrastText: "#000000DE",
  },
  {
    main: lime[100],
    contrastText: "#000000DE",
  },
  {
    main: yellow[100],
    contrastText: "#000000DE",
  },
  {
    main: amber[100],
    contrastText: "#000000DE",
  },
  {
    main: orange[100],
    contrastText: "#000000DE",
  },
  {
    main: deepOrange[100],
    contrastText: "#000000DE",
  },
  {
    main: brown[100],
    contrastText: "#000000DE",
  },
];

const join = (list, data) => {
  return list.map(name => data.reduce((prev, cur, index) => Object.assign({}, prev, {[`color_${name}_${index}`]: cur})), {}).reduce((prev, cur) => Object.assign({}, prev, {...cur}), {});
};

const globalColors = {
  ...join([FUTURE, PRESENT], future),
  ...join([PAST], past),
};

const mainTheme = createMuiTheme({
  palette: {
    ...globalColors,
    primary: {
      contrastText: "#fff",
      dark: blue[800],
      light: blue[600],
      main: blue[700]
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        ...Object.keys(globalColors).reduce((prev, name) => Object.assign({}, prev, {[`.${name}`]: {color: `${globalColors[name].contrastText} !important`, backgroundColor: `${globalColors[name].main} !important`}}), {})
      }
    },
  }
});

export default mainTheme;