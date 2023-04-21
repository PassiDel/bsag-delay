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

export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export const useTiming = () =>
  (globalThis as any).__timing__ as {
    logStart: (id: string) => void;
    logEnd: (id: string) => void;
    metrics: [string, number, number][];
  };
