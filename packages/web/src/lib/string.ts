export const toTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const naturalListJoin = (index: number, length: number) => {
  const total = length - 1;

  if (index === total) return "";
  if (index === total - 1) return " and ";
  return ", ";
};
