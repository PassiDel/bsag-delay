import { prisma } from '~/server/prisma';
import { secondsToHuman } from '~/server/time';
import { defineEventHandler } from 'h3';

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

    console.log(routes);

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

    console.log(stopTimes.length);

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

    console.log(stops.length);

    return {
      name,
      total_count: Number(total_count),
      trips: Number(trip_count),
      avg_dep: secondsToHuman(avg_dep),
      avg_arr: secondsToHuman(avg_arr),
      avg_added: secondsToHuman(avg_added),
      stops: stopTimes
        .map((st) => stops.find((s) => s.stop_id === st.stop_id)!!)
        .map(({ stop_id, ...s }) => s)
    };
  } catch (e) {
    console.error(name, e);
    throw createError({
      statusCode: 404,
      message: `Not found: "${name}"`
    });
  }
});
