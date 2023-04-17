import { getBoxValues } from '~/utils/percent';
import { prisma } from '~/server/prisma';

export default defineEventHandler(async (event) => {
  const stops = await prisma.$queryRaw<
    {
      stop_name: string;
      total_count: bigint;
      avg_added: string;
      stop_lat: string;
      stop_lon: string;
      max_added: number;
      max_dep: number;
    }[]
  >`select S.stop_name                                                    as stop_name,
           S.stop_lat,
           S.stop_lon,
           count(*)                                                       as total_count,
           cast(avg(coalesce(departure_delay, 0) - coalesce(arrival_delay, 0))  AS DECIMAL(16,2)) as avg_added,
           max(coalesce(departure_delay, 0) - coalesce(arrival_delay, 0)) as max_added,
           max(departure_delay) as max_dep
    from "StopDelay" SD
             left join "Stop" S on SD.stop_id = S.stop_id and S.date = SD.date
    where S.stop_name is not null
    group by S.stop_name, S.stop_lat, S.stop_lon`;

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
});
