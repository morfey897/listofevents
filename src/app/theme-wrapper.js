
import React, { useCallback, useEffect, useState } from 'react';

import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import store from "store2";

import createAppTheme from "../themes/app-theme";
import { ScreenProvider } from '../providers';
import DialogProvider from '../providers/dialog-provider';
import { useMediaQuery } from '@material-ui/core';
import { ThemeEmitter } from '../emitters';
import { EVENTS } from '../enums';

const DARK_MODE = "dark_mode";
function ThemeWrapper() {
  
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(store.get(DARK_MODE) === true);

  useEffect(() => {
    ThemeEmitter.on(EVENTS.UI_DARK_MODE, onChangeDarkMode);
    return () => {
      ThemeEmitter.off(EVENTS.UI_DARK_MODE, onChangeDarkMode);
    };
  }, []);

  useEffect(() => {
    const curState = store.get(DARK_MODE);
    if (typeof curState === "boolean") {
      setDarkMode(curState);
    } else if (prefersDarkMode) {
      store.set(DARK_MODE, prefersDarkMode);
      setDarkMode(prefersDarkMode);
    }
  }, [prefersDarkMode]);

  const onChangeDarkMode = useCallback(() => {
    setDarkMode((darkMode) => {
      store.set(DARK_MODE, !darkMode);
      return !darkMode;
    });
  }, []);

  return (
    <MuiThemeProvider theme={createAppTheme(darkMode)}>
      <CssBaseline />
      <ScreenProvider />
      <DialogProvider />
    </MuiThemeProvider>
  );
}

export default ThemeWrapper;