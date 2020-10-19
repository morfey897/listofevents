
import React, { useEffect } from 'react';

import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import createAppTheme from "../themes/app-theme";
import { connect } from 'react-redux';
import { ScreenProvider } from '../providers';
import DialogProvider from '../providers/dialog-provider';
import { useMediaQuery } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { appDarkThemeActionCreator } from '../model/actions';

function ThemeWrapper({darkMode, detectDarkMode, darkTheme}) {
  
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  useEffect(() => {
    if (prefersDarkMode && detectDarkMode === "auto") {
      darkTheme();
    }
  }, [prefersDarkMode]);

  return (
    <MuiThemeProvider theme={createAppTheme(darkMode)}>
      <CssBaseline />
      <ScreenProvider />
      <DialogProvider />
    </MuiThemeProvider>
  );
}

const mapStateToProps = (state) => {
  const {apps} = state;
  return {
    darkMode: apps.darkMode,
    detectDarkMode: apps.detectDarkMode,
  };
};


const mapDispatchToProps = dispatch => bindActionCreators({
  darkTheme: appDarkThemeActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ThemeWrapper);