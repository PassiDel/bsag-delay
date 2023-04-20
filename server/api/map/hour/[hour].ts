import { prisma } from '~/server/prisma';
import { StopData, transformMapData } from '~/server/mapData';
import { toTimeString } from '~/utils/days';

export default defineEventHandler(async (event) => {
  const { hour: hourRaw } = event.context.params!!;

  const hour = parseInt(hourRaw);
  const start = new Date(0);
  start.setHours(hour);

  const end = new Date(0);
  end.setHours(hour + 1);
  console.log(hour);
  const stops = await prisma.$queryRaw<
    StopData[]
  >`select S.stop_name                                                                            as stop_name,
           count(SD.*)                                                                            as total_count,
           cast(avg(coalesce(departure_delay, 0) - coalesce(arrival_delay, 0)) AS DECIMAL(16, 2)) as avg_added,
           max(coalesce(departure_delay, 0) - coalesce(arrival_delay, 0))                         as max_added,
           max(departure_delay)                                                                   as max_dep
    from "Stop" S
             left join "StopDelay" SD on SD.stop_id = S.stop_id and S.date = SD.date
    where S.stop_name is not null
      and SD.start_time between ${toTimeString(start)}::time and ${toTimeString(
    end
  )}::time
    group by S.stop_name
    order by S.stop_name`;

  return transformMapData(stops);
});
