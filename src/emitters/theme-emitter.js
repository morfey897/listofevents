import EventEmitter from 'eventemitter3';

const themeEmitter = new EventEmitter();

const ThemeEmitter = {
  on: (event, fn) => themeEmitter.on(event, fn),
  off: (event, fn) => themeEmitter.off(event, fn),
  once: (event, fn) => themeEmitter.once(event, fn),
  emit: (event, payload = {}) => themeEmitter.emit(event, {...payload}),
  clear: (event) => themeEmitter.removeAllListeners(event),
};

Object.freeze(ThemeEmitter);

export default ThemeEmitter;