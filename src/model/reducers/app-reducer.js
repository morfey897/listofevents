import { TOGGLE_THEME, DARK_THEME } from "../actions/app-action";

const initState = {
  detectDarkMode: 'auto',
  darkMode: false,
};

export function apps(state = initState, action) {
  const {type, payload} = action;

  switch (type) {
    case TOGGLE_THEME:
      return {
        ...state,
        darkMode: typeof payload.darkMode === "boolean" ? payload.darkMode : !state.darkMode,
        detectDarkMode: 'manual',
      };
    case DARK_THEME:
      return {
        ...state,
        darkMode: true,
      };
    default:
      return state;
  }
}