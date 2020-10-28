import React, { useCallback, useEffect, useReducer } from "react";
import { DialogEmitter } from "../services";

import { AddEventDialog } from "../dialogs";
import { DIALOGS, EVENTS } from "../enums";

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
    default:
      throw new Error();
  }
}

function DialogProvider() {

  const [state, dispatch] = useReducer(reducer, initialState);

  const onOpen = useCallback(({ wnd, ...data }) => {
    dispatch({ type: 'open', payload: { wnd, data } });
  }, []);

  const onClose = useCallback(({ wnd, ...data }) => {
    dispatch({ type: 'close', payload: { wnd, data } });
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
        switch (wnd) {
          case DIALOGS.ADD_EVENT: return <AddEventDialog key={wnd} {...data} open={isOpen === 1} handleClose={(state) => DialogEmitter.close(wnd, state)} />;

          default: return null;
        }
      })
    }

  </>;
}

export default DialogProvider;