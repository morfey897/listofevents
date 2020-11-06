import EventEmitter from 'eventemitter3';
import { EVENTS } from "../enums";

const eventEmitter = new EventEmitter();

const DialogEmitter = {
  on: (event, fn) => eventEmitter.on(event, fn),
  off: (event, fn) => eventEmitter.off(event, fn),
  once: (event, fn) => eventEmitter.once(event, fn),

  open: (wnd, payload = {}) => eventEmitter.emit(EVENTS.WND_OPEN, {wnd, ...payload}),
  close: (wnd, payload = {}) => eventEmitter.emit(EVENTS.WND_CLOSE, {wnd, ...payload}),

  emit: (event, payload = {}) => eventEmitter.emit(event, {...payload}),
  clear: (event) => eventEmitter.removeAllListeners(event),
};

Object.freeze(DialogEmitter);

export default DialogEmitter;