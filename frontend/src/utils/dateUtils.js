export const getLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getStartOfLocalDay = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

export const getEndOfLocalDay = (date = new Date()) => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const getLocalDayOffset = (offsetDays = 0, referenceDate = new Date()) => {
  const date = new Date(referenceDate);
  date.setDate(referenceDate.getDate() + offsetDays);
  date.setHours(0, 0, 0, 0);
  return date;
};
