import { teal, green, lime, amber, lightGreen, yellow, orange, deepOrange, brown, blueGrey } from '@material-ui/core/colors';
import { TENSE } from '../enums';

const colors = [

  {
    order: 100,
    [TENSE.FUTURE]: {
      main: lightGreen[900],
      contrastText: "#fff",
    }, [TENSE.PAST]: {
      main: lightGreen[100],
      contrastText: "#000000DE",
    }
  },

  {
    order: 80,
    [TENSE.FUTURE]: {
      main: lime[900],
      contrastText: "#fff",
    }, [TENSE.PAST]: {
      main: lime[100],
      contrastText: "#000000DE",
    }
  },

  {
    order: 90,
    [TENSE.FUTURE]: {
      main: yellow[900],
      contrastText: "#000000DE",
    }, [TENSE.PAST]: {
      main: yellow[100],
      contrastText: "#000000DE",
    }
  },

  {
    order: 70,
    [TENSE.FUTURE]: {
      main: amber[900],
      contrastText: "#000000DE",
    }, [TENSE.PAST]: {
      main: amber[100],
      contrastText: "#000000DE",
    }
  },

  {
    order: 40,
    [TENSE.FUTURE]: {
      main: orange[900],
      contrastText: "#fff",
    }, [TENSE.PAST]: {
      main: orange[100],
      contrastText: "#000000DE",
    }
  },

  {
    order: 60,
    [TENSE.FUTURE]: {
      main: deepOrange[900],
      contrastText: "#fff",
    }, [TENSE.PAST]: {
      main: deepOrange[100],
      contrastText: "#000000DE",
    }
  },

  {
    order: 50,
    [TENSE.FUTURE]: {
      main: teal[900],
      contrastText: "#fff",
    }, [TENSE.PAST]: {
      main: teal[100],
      contrastText: "#000000DE",
    }
  },

  {
    order: 30,
    [TENSE.FUTURE]: {
      main: green[900],
      contrastText: "#fff",
    }, [TENSE.PAST]: {
      main: green[100],
      contrastText: "#000000DE",
    }
  },

  {
    order: 20,
    [TENSE.FUTURE]: {
      main: brown[900],
      contrastText: "#fff",
    }, [TENSE.PAST]: {
      main: brown[100],
      contrastText: "#000000DE",
    }
  },

  {
    order: 10,
    [TENSE.FUTURE]: {
      main: blueGrey[900],
      contrastText: "#fff",
    }, [TENSE.PAST]: {
      main: blueGrey[100],
      contrastText: "#000000DE",
    }
  },
].sort((a, b) => (b.order || 0) - (a.order || 0));

export function getColorIndex(index) {
  if (index < 0 || isNaN(parseInt(index))) return colors.length - 1;
  return Math.min(index, colors.length - 1);
}

export default colors;