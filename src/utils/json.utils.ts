export const toJSON = (data: unknown) => JSON.stringify(data);
export const isJSON = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
