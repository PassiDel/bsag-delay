import { prisma } from '~/server/prisma';
import { nonNullable, secondsToHuman } from '~/server/time';
import { transformStats } from '~/server/mapData';

export default cachedEventHandler(async (event) => {
  const { name: rawName } = event.context.params!!;

  const name = decodeURI(rawName);

  try {
    const routes = await prisma.route.findMany({
      where: {
        route_short_name: name
      },
      select: {
        route_id: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    const [{ total_count, avg_dep, avg_arr, avg_added, trips: trip_count }]: {
      total_count: bigint;
      avg_dep: number;
      avg_arr: number;
      avg_added: number;
      trips: bigint;
    }[] =
      await prisma.$queryRawUnsafe(`select count(*)                                                       as total_count,
       count(distinct trip_id + start_date) as trips,
                                        avg(departure_delay)                                           as avg_dep,
                                        avg(arrival_delay)                                             as avg_arr,
                                        avg(coalesce(departure_delay, 0) - coalesce(arrival_delay, 0)) as avg_added
                                 from "StopDelay" SD
                                 
                                 where SD.route_id in (${routes
                                   .map((r) => r.route_id)
                                   .join(', ')});`);

    const trips = await prisma.trip.findMany({
      where: {
        route_id: {
          in: routes.map((r) => r.route_id)
        }
      },
      select: {
        trip_id: true
      }
    });

    console.log(trips.length);

    const stopTimes = await prisma.stopTime.findMany({
      where: {
        trip_id: {
          in: trips.map((t) => t.trip_id)
        }
      },
      select: {
        stop_id: true
      },
      orderBy: {
        stop_sequence: 'asc'
      },
      distinct: ['stop_id']
    });

    const stops = await prisma.stop.findMany({
      where: {
        stop_id: {
          in: stopTimes.map((s) => s.stop_id)
        }
      },
      distinct: ['stop_name'],
      select: {
        stop_id: true,
        stop_name: true,
        stop_lon: true,
        stop_lat: true
      }
    });

    const dates = await prisma.stopDelay.findMany({
      distinct: ['start_date'],
      select: {
        start_date: true
      },
      orderBy: {
        start_date: 'asc'
      }
    });

    const stats = await Promise.all(
      dates.map(async (d) => {
        const [{ total, min, db }] = await prisma.$queryRawUnsafe<
          {
            total: bigint;
            min: bigint;
            db: bigint;
          }[]
        >(`Select count(q) as total, sum(q.min) as min, sum(q.db) as db
           from (SELECT trip_id,
                        CASE When SUM(CASE when departure_delay > 60 then 1 else 0 end) > 0 then 1 else 0 end  as min,
                        CASE When SUM(CASE when departure_delay > 300 then 1 else 0 end) > 0 then 1 else 0 end as db
                 FROM "StopDelay" t
                 where start_date = '${
                   d.start_date.toISOString().split('T')[0]
                 }'
                   and t.route_id in (${routes
                     .map((r) => r.route_id)
                     .join(', ')})

                 group by trip_id) q
        ;`);
        return transformStats(d.start_date, total, min, db);
      })
    );

    return {
      name,
      total_count: Number(total_count),
      trips: Number(trip_count),
      avg_dep: secondsToHuman(avg_dep),
      avg_arr: secondsToHuman(avg_arr),
      avg_added: secondsToHuman(avg_added),
      stops: stopTimes
        .map((st) => stops.find((s) => s.stop_id === st.stop_id))
        .filter(nonNullable)
        .map(({ stop_id, ...s }) => s),
      stats
    };
  } catch (e) {
    console.error(name, e);
    throw createError({
      statusCode: 404,
      message: `Not found: "${name}"`
    });
  }
});
