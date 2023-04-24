import { prisma } from '~/server/prisma';
import { transformStats } from '~/server/mapData';

export default cachedEventHandler(async () => {
  const dates = await prisma.stopDelay.findMany({
    distinct: ['start_date'],
    select: {
      start_date: true
    },
    orderBy: {
      start_date: 'asc'
    }
  });

  return await Promise.all(
    dates.map(async (d) => {
      const [{ total, min, db }] = await prisma.$queryRaw<
        {
          total: bigint;
          min: bigint;
          db: bigint;
        }[]
      >`Select count(q) as total, sum(q.min) as min, sum(q.db) as db
        from (SELECT trip_id,
                     CASE When SUM(CASE when departure_delay > 60 then 1 else 0 end) > 0 then 1 else 0 end  as min,
                     CASE When SUM(CASE when departure_delay > 300 then 1 else 0 end) > 0 then 1 else 0 end as db
              FROM public."StopDelay" t
              where start_date = ${d.start_date}
              group by trip_id) q
      ;`;
      return transformStats(d.start_date, total, min, db);
    })
  );
});
