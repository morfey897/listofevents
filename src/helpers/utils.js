const GRID_MAP_3 = {
  1: [3],
  2: [2, 1],
  3: [1, 2, 3],
  4: [2, 1, 1, 2],
  5: [1, 2, 3, 2, 1],
};


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

export const calcCol = (len, index, maxCols) => {
  let grid = GRID_MAP_3[len];
  return grid ? grid[index] : 1;
};