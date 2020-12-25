export const appRoot = () => document.getElementById("app-root");
export const windowRoot = () => document.getElementById("window-root");
export const addZiro = (num) => ("0" + num).slice(-2);
export const getTimeOffset = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  if (offset > 0) return `GMT-${addZiro(parseInt(offset / 60))}:${addZiro((offset % 60))}`;
  if (offset < 0) return `GMT+${addZiro(parseInt(-offset / 60))}:${addZiro((-offset % 60))}`;
  return "UTC";
};