import { config } from "../../api";
import { ERRORCODES } from "../../enums";

export const CONFIG_PENDING = "config_pending";
export const CONFIG_INITED = "config_inited";
export const CONFIG_ERROR = "config_error";

export function fetchConfigActionCreator() {
  return (dispatch) => {
    dispatch({ type: CONFIG_PENDING });
    return config()
      .then(({ success, errorCode, data }) => {
        if (success) {
          dispatch({ type: CONFIG_INITED, payload: { data } });
        } else {
          dispatch({ type: CONFIG_ERROR, payload: { errorCode } });
        }
      })
      .catch(() => dispatch({ type: CONFIG_ERROR, payload: { errorCode: ERRORCODES.ERROR_WRONG } }));
  };
}