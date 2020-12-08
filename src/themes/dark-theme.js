import { TENSE } from '../enums';
import mainColors from './colors';

const join = (list, data) => list.map(name => data.reduce((prev, cur, index) => Object.assign({}, prev, { [`color_${name}_${index}`]: cur[name] || cur[Object.keys(cur).find(locName => list.indexOf(locName) !== -1)] }), {}))
  .reduce((prev, cur) => Object.assign({}, prev, { ...cur }), {});

const globalColors = {
  ...join([TENSE.FUTURE, TENSE.PRESENT], mainColors),
  ...join([TENSE.PAST], mainColors),
};

export default {
  palette: {
    type: "dark", 
    common: {
      black: "#000",
      white: "#fff"
    },
    primary: { 
      main: "#90caf9", 
      light: "rgb(166, 212, 250)", 
      dark: "rgb(100, 141, 174)", 
      contrastText: "rgba(0, 0, 0, 0.87)" 
    }, 
    secondary: { 
      main: "#f48fb1", 
      light: "rgb(246, 165, 192)", 
      dark: "rgb(170, 100, 123)", 
      contrastText: "rgba(0, 0, 0, 0.87)" 
    }, 
    error: { 
      light: "#e57373", 
      main: "#f44336", 
      dark: "#d32f2f", 
      contrastText: "#fff" 
    }, 
    warning: { 
      light: "#ffb74d", 
      main: "#ff9800", 
      dark: "#f57c00", 
      contrastText: "rgba(0, 0, 0, 0.87)" 
    }, 
    info: { 
      light: "#64b5f6", 
      main: "#2196f3", 
      dark: "#1976d2", 
      contrastText: "#fff" 
    }, 
    success: { 
      light: "#81c784", 
      main: "#4caf50", 
      dark: "#388e3c", 
      contrastText: "rgba(0, 0, 0, 0.87)" 
    }, 
    grey: { 
      "50": "#fafafa", 
      "100": "#f5f5f5", 
      "200": "#eeeeee", 
      "300": "#e0e0e0", 
      "400": "#bdbdbd", 
      "500": "#9e9e9e", 
      "600": "#757575", 
      "700": "#616161", 
      "800": "#424242", 
      "900": "#212121", 
      "A100": "#d5d5d5", 
      "A200": "#aaaaaa", 
      "A400": "#303030", 
      "A700": "#616161" 
    }, 
    contrastThreshold: 3, 
    tonalOffset: 0.2, 
    text: { 
      primary: "#fff", 
      secondary: "rgba(255, 255, 255, 0.7)", 
      disabled: "rgba(255, 255, 255, 0.5)", 
      hint: "rgba(255, 255, 255, 0.5)", 
      icon: "rgba(255, 255, 255, 0.5)" 
    }, 
    divider: "rgba(255, 255, 255, 0.12)", 
    background: { 
      paper: "#424242", 
      default: "#121212", 
      level2: "#333", 
      level1: "#212121" 
    }, 
    action: { 
      active: "#fff", 
      hover: "rgba(255, 255, 255, 0.08)", 
      hoverOpacity: 0.08, 
      selected: "rgba(255, 255, 255, 0.16)", 
      selectedOpacity: 0.16, 
      disabled: "rgba(255, 255, 255, 0.3)", 
      disabledBackground: "rgba(255, 255, 255, 0.12)", 
      disabledOpacity: 0.38, 
      focus: "rgba(255, 255, 255, 0.12)", 
      focusOpacity: 0.12, 
      activatedOpacity: 0.24 
    }
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        ...Object.keys(globalColors).reduce((prev, name) => Object.assign({}, prev, { [`.${name}`]: { color: `${globalColors[name].contrastText} !important`, backgroundColor: `${globalColors[name].main} !important` } }), {})
      }
    },
    MuiDialog:{
      paper: {
        overflowY: "none"
      }
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: "#424242" // Pink AppBar       
      }
    },
    MuiIconButton: {
      colorInherit: {
        color: "#fff"
      }
    },
    MuiButton: {
      colorInherit: {
        color: "#fff"
      }
    },
    MuiDialogTitle: {
      root: {
        "&.boxes": {
          "& > .MuiBox-root": {
            marginTop: '-40px',
            backgroundColor: "#2196f3",
            background: `linear-gradient(90deg, #2196f3 0, #1976d2 100%)`,
            borderRadius: "8px",
            "& > .MuiTypography-root": {
              paddingTop: "8px",
              height: '50px',
              color: "#fff"
            }
          }
        }
      }
    },
    MuiAutocomplete: {
      tag: {
        color: "#90caf9",
        textDecoration: "underline"
      }
    }
  }
};