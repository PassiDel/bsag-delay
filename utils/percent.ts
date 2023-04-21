export function getPercentile(data: number[], percentile: number) {
  data.sort((a, b) => a - b);
  const index = (percentile / 100) * data.length;

  if (Math.floor(index) == index) {
    return (data[index - 1] + data[index]) / 2;
  }
  return parseFloat(data[Math.floor(index)].toFixed(2));
}

export function getBoxValues(data: number[]) {
  return {
    low: Math.min.apply(Math, data),
    q1: getPercentile(data, 25),
    median: getPercentile(data, 50),
    q3: getPercentile(data, 75),
    high: Math.max.apply(Math, data)
  };
}
