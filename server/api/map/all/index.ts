import { prisma } from '~/server/prisma';
import { StopData, transformMapData } from '~/server/mapData';

export default cachedEventHandler(async () => {
  const stops = await prisma.$queryRaw<
    StopData[]
  >`select S.stop_name                                                                            as stop_name,
           count(SD.*)                                                                            as total_count,
           cast(avg(coalesce(departure_delay, 0) - coalesce(arrival_delay, 0)) AS DECIMAL(16, 2)) as avg_added,
           max(coalesce(departure_delay, 0) - coalesce(arrival_delay, 0))                         as max_added,
           cast(avg(coalesce(departure_delay, 0)) AS DECIMAL(16, 2))                              as avg_dep,
           max(departure_delay)                                                                   as max_dep
    from "Stop" S
             left join "StopDelay" SD on SD.stop_id = S.stop_id and S.date = SD.date
    where S.stop_name is not null
    group by S.stop_name
    order by S.stop_name`;

  return transformMapData(stops);
});
