export const getFormattedDate = (date) => {
  if (!date) return null;
  const dateObj = new Date(date);

  const month = getMonthShortName(dateObj.getMonth());
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  const formattedDate = `${month}, ${day}, ${year}`;
  return formattedDate;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const getMonthShortName = (monthNo) => {
  const date = new Date();
  date.setMonth(monthNo);

  return date.toLocaleString("en-US", { month: "short" });
};
