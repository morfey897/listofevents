import { config } from "../../api";
import { ERRORCODES, STATES } from "../../enums";

export const CONFIG_UPDATE_STATE = "config_update_state";

export function fetchConfigActionCreator() {
  return (dispatch) => {
    dispatch({ type: CONFIG_UPDATE_STATE, payload: { data: {}, state: STATES.STATE_LOADING, errorCode: 0 } });
    return config()
      .then(({ success, errorCode, data }) => {
        if (success) {
          dispatch({ type: CONFIG_UPDATE_STATE, payload: { data, state: STATES.STATE_READY, errorCode: 0 } });
        } else {
          dispatch({ type: CONFIG_UPDATE_STATE, payload: { data: {}, state: STATES.STATE_ERROR, errorCode } });
        }
      })
      .catch(() => dispatch({ type: CONFIG_UPDATE_STATE, payload: { data: {}, state: STATES.STATE_ERROR, errorCode: ERRORCODES.ERROR_WRONG } }));
  };
}