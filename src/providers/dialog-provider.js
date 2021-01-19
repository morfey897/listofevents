import { useCallback, useEffect, useReducer } from "react";
import { DialogEmitter } from "../emitters";

import { AddEventDialog, SigninDialog, SignupDialog, SignoutDialog, ProfileDialog, UsersListDialog, AddCategoryDialog, ConfirmDeleteDialog } from "../dialogs";
import { DIALOGS, EVENTS } from "../enums";
import { debounce, useTheme } from "@material-ui/core";

const initialState = {
  wnds: [], //Object.values(WN).map(wnd => ({ wnd, isOpen: 0, data: {}, order: 0 }))
  opening: 0
};

function reducer(state, action) {
  const { type, payload: { data, wnd } } = action;
  switch (type) {
    case 'open': {
      const isInit = !!state.wnds.find((f) => f.wnd === wnd);
      const wnds = isInit ? state.wnds.map((f) => wnd === f.wnd && f.isOpen === 0 ? { ...f, isOpen: 1, data, order: state.opening + 1 } : f) : state.wnds.concat({ wnd, isOpen: 1, data, order: state.opening + 1 });
      return {
        wnds,
        opening: wnds.reduce((accumulator, { isOpen }) => accumulator + isOpen, 0)
      };
    }
    case 'close': {
      const isInit = !!state.wnds.find((f) => f.wnd === wnd);
      if (!isInit) return state;
      const wnds = state.wnds.map((f) => wnd === f.wnd && f.isOpen === 1 ? { ...f, isOpen: 0, data } : f);
      return {
        wnds,
        opening: wnds.reduce((accumulator, { isOpen }) => accumulator + isOpen, 0)
      };
    }
    case 'clear':
      return {
        ...state,
        wnds: state.wnds.filter(f => wnd !== f.wnd),
    };
    default:
      throw new Error();
  }
}

const clears = {};
function DialogProvider() {

  const theme = useTheme(); 
  const [state, dispatch] = useReducer(reducer, initialState);

  const onOpen = useCallback(({ wnd, ...data }) => {
    clears[wnd] && clears[wnd].clear();
    dispatch({ type: 'open', payload: { wnd, data } });
  }, []);

  const onClose = useCallback(({ wnd, ...data }) => {
    clears[wnd] && clears[wnd].clear();
    dispatch({ type: 'close', payload: { wnd, data } });
    clears[wnd] = debounce(() => dispatch({ type: 'clear', payload: { wnd } }), theme.props.MuiDialog.transitionDuration.exit);
    clears[wnd]();
  }, []);

  useEffect(() => {
    DialogEmitter.on(EVENTS.WND_OPEN, onOpen);
    DialogEmitter.on(EVENTS.WND_CLOSE, onClose);
    return () => {
      DialogEmitter.off(EVENTS.WND_OPEN, onOpen);
      DialogEmitter.off(EVENTS.WND_CLOSE, onClose);
    };
  }, []);

  return <>
    {
      state.wnds.map(({ wnd, isOpen, data }) => {
        const params = { ...data, open: isOpen === 1, handleClose: (state) => DialogEmitter.close(wnd, state) };
        switch (wnd) {
          case DIALOGS.ADD_EVENT: return <AddEventDialog key={wnd} {...params} />;
          case DIALOGS.ADD_CATEGORY: return <AddCategoryDialog key={wnd} {...params} />;
          case DIALOGS.SIGNIN: return <SigninDialog key={wnd} {...params} />;
          case DIALOGS.SIGNUP: return <SignupDialog key={wnd} {...params} />;
          case DIALOGS.SIGNOUT: return <SignoutDialog key={wnd} {...params} />;
          case DIALOGS.PROFILE: return <ProfileDialog key={wnd} {...params} />;
          case DIALOGS.USERS_LIST: return <UsersListDialog key={wnd} {...params} />;
          case DIALOGS.CONFIRM_DELETE: return <ConfirmDeleteDialog key={wnd} {...params} />;
          default: return null;
        }
      })
    }

  </>;
}

export default DialogProvider;