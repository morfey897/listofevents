export const TOGGLE_THEME = "app_toggle_theme";
export const DARK_THEME = "app_dark_theme";

export function appDarkThemeActionCreator() {
  return (dispatch) => {
    return dispatch({ type: DARK_THEME, payload: {} });
  };
}

export function appToggleThemeActionCreator(darkMode) {
  return (dispatch) => {
    return dispatch({ type: TOGGLE_THEME, payload: {darkMode} });
  };
}
