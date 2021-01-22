import { createMuiTheme } from '@material-ui/core/styles';
import darkTheme from "./dark-theme";
import lightTheme from "./light-theme";


const props = {
  MuiDialog: {
    transitionDuration: {
      enter: 400,
      exit: 300
    }
  }
};

function createAppTheme(darkMode) {
  let theme = createMuiTheme({props, ...(darkMode ? darkTheme : lightTheme)});
  window.theme = theme;
  return theme;
}

export default createAppTheme;