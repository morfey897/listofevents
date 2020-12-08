import EventEmitter from 'eventemitter3';
import { ERRORCODES } from "../errors";

const eventEmitter = new EventEmitter();

const ErrorEmitter = {
  on: (event, fn) => eventEmitter.on(event, fn),
  off: (event, fn) => eventEmitter.off(event, fn),
  once: (event, fn) => eventEmitter.once(event, fn),
  emit: (event, errorCode, message = "") => eventEmitter.emit(event, { message, errorCode: errorCode || ERRORCODES.ERROR_WRONG }),
  clear: (event) => eventEmitter.removeAllListeners(event),
};

Object.freeze(ErrorEmitter);

export default ErrorEmitter;