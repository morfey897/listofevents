import { createMuiTheme } from '@material-ui/core/styles';
import { FUTURE, PAST, PRESENT } from '../enums/tense';
import colors from './colors';

const join = (list, data) => list.map(name => data.reduce((prev, cur, index) => Object.assign({}, prev, {[`color_${name}_${index}`]: cur[name] || cur[Object.keys(cur).find(locName => list.indexOf(locName) !== -1)]}), {}))
                                  .reduce((prev, cur) => Object.assign({}, prev, {...cur}), {});

const globalColors = {
  ...join([FUTURE, PRESENT], colors),
  ...join([PAST], colors),
};

function createAppTheme(darkMode) {
  return createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : "light",
      // ...globalColors,
      // primary: {
        // contrastText: "#fff",
        // dark: "#000",
      //   light: blue[600],
        // main: blue[700]
      // },
    },
    overrides: {
      MuiCssBaseline: {
        "@global": {
          ...Object.keys(globalColors).reduce((prev, name) => Object.assign({}, prev, {[`.${name}`]: {color: `${globalColors[name].contrastText} !important`, backgroundColor: `${globalColors[name].main} !important`}}), {})
        }
      },
    }
  });
} 

export default createAppTheme;