import { createMuiTheme } from '@material-ui/core/styles';
import {blue, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, blueGrey} from '@material-ui/core/colors';

const mainTheme = createMuiTheme({
  palette: {
    color_set_0: {
      main: blueGrey[900],
      contrastText: "#fff",
    },
    color_set_1: {
      main: teal[900],
      contrastText: "#fff",
    },
    color_set_2: {
      main: green[900],
      contrastText: "#fff",
    },
    color_set_3: {
      main: lightGreen[900],
      contrastText: "#fff",
    },
    color_set_4: {
      main: lime[900],
      contrastText: "#fff",
    },
    color_set_5: {
      main: yellow[900],
      contrastText: "#000000DE",
    },
    color_set_6: {
      main: amber[900],
      contrastText: "#000000DE",
    },
    color_set_7: {
      main: orange[900],
      contrastText: "#fff",
    },
    color_set_8: {
      main: deepOrange[900],
      contrastText: "#fff",
    },
    color_set_9: {
      main: brown[900],
      contrastText: "#fff",
    },

    color_disable_0: {
      main: blueGrey[100],
      contrastText: "#000000DE",
    },
    color_disable_1: {
      main: teal[100],
      contrastText: "#000000DE",
    },
    color_disable_2: {
      main: green[100],
      contrastText: "#000000DE",
    },
    color_disable_3: {
      main: lightGreen[100],
      contrastText: "#000000DE",
    },
    color_disable_4: {
      main: lime[100],
      contrastText: "#000000DE",
    },
    color_disable_5: {
      main: yellow[100],
      contrastText: "#000000DE",
    },
    color_disable_6: {
      main: amber[100],
      contrastText: "#000000DE",
    },
    color_disable_7: {
      main: orange[100],
      contrastText: "#000000DE",
    },
    color_disable_8: {
      main: deepOrange[100],
      contrastText: "#000000DE",
    },
    color_disable_9: {
      main: brown[100],
      contrastText: "#000000DE",
    },
    
    primary: {
      contrastText: "#fff",
      dark: blue[800],
      light: blue[600],
      main: blue[700]
    }
  }
});

console.log(mainTheme);
export default mainTheme;