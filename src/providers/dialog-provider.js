import React, { useCallback, useEffect, useState } from "react";
import {DialogEmitter} from "../services";

import {AddEventDialog} from "../dialogs";
import { ADD_EVENT } from "../enums/dialogs";

function DialogProvider() {

  const [addEvent, setAddEvent] = useState({open: false, payload: {}});

  const onAddEvent = useCallback((payload) => {
    if (payload === false) {
      setAddEvent({open: false, payload: {}});
    } else {
      setAddEvent({open: true, payload: payload || {}});
    }
  }, []);

  useEffect(() => {

    DialogEmitter.on(ADD_EVENT, onAddEvent);

    return () => {
      DialogEmitter.clear(ADD_EVENT);
    };
  }, []);

  return <>
    <AddEventDialog open={addEvent.open} handleClose={() => onAddEvent(false)} {...addEvent.payload}/>
  </>;
}

export default DialogProvider;