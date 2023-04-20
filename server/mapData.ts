import { getBoxValues } from '~/utils/percent';

export type StopData = {
  stop_name: string;
  total_count: bigint;
  avg_added: string;
  max_added: number;
  max_dep: number;
};
export function transformMapData(stops: StopData[]) {
  const data = stops.map(({ total_count, avg_added, ...s }) => ({
    count: Number(total_count),
    avg: Number(avg_added),
    ...s
  }));

  return {
    data,
    maxCount: data.reduce((acc, d) => (d.count > acc ? d.count : acc), 0),
    boxValues: {
      avg: getBoxValues(data.map((d) => d.avg)),
      count: getBoxValues(data.map((d) => d.count))
    }
  };
}
