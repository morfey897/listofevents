import { createMuiTheme } from '@material-ui/core/styles';
import { TENSE } from '../enums';
import colors from './colors';
import yellow from '@material-ui/core/colors/yellow';

const join = (list, data) => list.map(name => data.reduce((prev, cur, index) => Object.assign({}, prev, {[`color_${name}_${index}`]: cur[name] || cur[Object.keys(cur).find(locName => list.indexOf(locName) !== -1)]}), {}))
                                  .reduce((prev, cur) => Object.assign({}, prev, {...cur}), {});

const globalColors = {
  ...join([TENSE.FUTURE, TENSE.PRESENT], colors),
  ...join([TENSE.PAST], colors),
};
console.log('yellow', yellow)
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