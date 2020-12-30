export const getArrayFromString = (string) => {
  if (!string) {
    return null;
  }
  const split = string.split(",");
  const result = [];
  for (let item of split) {
    result.push(item.replace(/\(.*\)$/, "").trim());
  }
  return result;
};
