import { createMuiTheme } from '@material-ui/core';
import darkTheme from "./dark-theme";
import lightTheme from "./light-theme";


function createAppTheme(darkMode) {
  let theme = createMuiTheme(darkMode ? darkTheme : lightTheme);
  window.theme = theme;
  return theme;
}

export default createAppTheme;