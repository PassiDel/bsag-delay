export function secondsToHuman(input: number) {
  let isNegative = false;
  if (input < 0) {
    input *= -1;
    isNegative = true;
  }
  const hours = Math.floor(input / 3600);
  const minutes = Math.floor(input / 60);
  const seconds = Math.floor(input % 60);

  return `${isNegative ? '- ' : ''}${padLead(hours)}:${padLead(
    minutes
  )}:${padLead(seconds)}`;
}

export function padLead(number: number, digits: number = 2) {
  return String(number).padStart(digits, '0');
}
