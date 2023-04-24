import { getBoxValues } from '~/utils/percent';

export type StopData = {
  stop_name: string;
  total_count: bigint;
  avg_added: string;
  avg_dep: string;
  max_added: number;
  max_dep: number;
};
export function transformMapData(stops: StopData[]) {
  const data = stops.map(({ total_count, avg_added, avg_dep, ...s }) => ({
    count: Number(total_count),
    avg: Number(avg_added),
    dep: Number(avg_dep),
    ...s
  }));

  return {
    data,
    maxCount: data.reduce((acc, d) => (d.count > acc ? d.count : acc), 0),
    boxValues: {
      avg: getBoxValues(data.map((d) => d.avg)),
      count: getBoxValues(data.map((d) => d.count)),
      dep: getBoxValues(data.map((d) => d.dep)),
      max_dep: getBoxValues(data.map((d) => d.max_dep)),
      max_added: getBoxValues(data.map((d) => d.max_added))
    }
  };
}

export function transformStats(
  date: Date,
  total: bigint,
  min: bigint,
  db: bigint
) {
  return {
    date,
    total: Number(total) - Number(min),
    min: Number(min) - Number(db),
    db: Number(db),
    perc: 100 - 100 * (Number(db) / Number(total)) || 0
  };
}
