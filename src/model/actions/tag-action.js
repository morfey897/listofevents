import { request } from "../../api";
import { ErrorEmitter } from "../../emitters";
import { ERRORTYPES } from "../../errors";

export const TAG_PENDING = "tag_pending";
export const TAG_INITED = "tag_inited";

const tagsQuery = `
query($limit: Int) {
  result: getTags(paginate:{limit: $limit}) {
    offset,
    total,
    list
  }
}`;

export function fetchTagsActionCreator() {
  return (dispatch) => {
    dispatch({ type: TAG_PENDING });
    return request(tagsQuery, { limit: 100 })
      .then(({ success, data, errorCode }) => {
        if (success) {
          dispatch({ type: TAG_INITED, payload: { ...data.result } });
        } else {
          dispatch({ type: TAG_INITED });
          ErrorEmitter.emit(ERRORTYPES.TAG_INIT_ERROR, errorCode);
        }
      })
      .catch(() => {
        dispatch({ type: TAG_INITED });
        ErrorEmitter.emit(ERRORTYPES.TAG_INIT_ERROR);
      });
  };
}
