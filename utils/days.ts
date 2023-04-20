export function getDaysArray(start: string | Date, end: string | Date) {
  const arr = [];
  for (
    const dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt));
  }
  return arr;
}

export function getMonthArray(start: string | Date, end: string | Date) {
  const arr = [];
  for (
    const dt = new Date(start);
    dt <= new Date(end);
    dt.setMonth(dt.getMonth() + 1)
  ) {
    arr.push(new Date(dt));
  }
  return arr;
}

export function toTimeString(date: Date) {
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}
