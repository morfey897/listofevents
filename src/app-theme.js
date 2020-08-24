import { createMuiTheme } from '@material-ui/core/styles';

const mainTheme = createMuiTheme({
  palette: {
    primary: {
      contrastText: "#fff",
      dark: "rgb(17, 82, 147)",
      light: "rgb(71, 145, 219)",
      main: "#1976d2"
    }
  }
});


export default mainTheme;