import { prisma } from '~/server/prisma';
import { defineEventHandler, getQuery } from 'h3';
import { secondsToHuman, useTiming } from '~/server/time';

export default defineEventHandler(async (event) => {
  const { page: pageRaw } = getQuery(event);
  const timing = useTiming();

  const page =
    pageRaw && typeof pageRaw === 'string' ? parseInt(pageRaw) || 1 : 1;

  const perPage = 20;

  timing.logStart('db');
  const stops = await prisma.$queryRaw<
    {
      name: string;
      total_count: bigint;
      avg_added: string;
    }[]
  >`select S.stop_name                                                    as name,
           count(*)                                                       as total_count,
           avg(coalesce(departure_delay, 0) - coalesce(arrival_delay, 0)) as avg_added
    from "StopDelay" SD
             left join "Stop" S on SD.stop_id = S.stop_id and S.date = SD.date
    group by S.stop_name
    order by total_count desc
    OFFSET ${(page - 1) * perPage} ROWS FETCH NEXT ${perPage} ROWS ONLY;`;

  const [{ count }] = await prisma.$queryRaw<
    { count: bigint }[]
  >`select count(*) as count
    from (select 1
          from "StopDelay" SD
                   left join "Stop" S on SD.stop_id = S.stop_id and S.date = SD.date
          group by S.stop_name) q;`;

  timing.logEnd('db');
  return {
    data: stops.map(({ total_count, name, avg_added }) => ({
      name,
      avg: secondsToHuman(parseFloat(avg_added)),
      count: Number(total_count)
    })),
    page,
    perPage,
    total: Number(count),
    lastPage: Math.ceil(Number(count) / perPage)
  };
});
