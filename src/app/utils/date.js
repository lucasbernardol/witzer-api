export const unix = () => {
  return Math.floor(new Date().getTime() / 1000);
};
