import { prisma } from '~/server/prisma';
import { secondsToHuman } from '~/server/time';
import { defineEventHandler } from 'h3';

export default cachedEventHandler(async (event) => {
  const { name: rawName } = event.context.params!!;

  const name = decodeURI(rawName);

  try {
    const { route_id, date } = await prisma.route.findFirstOrThrow({
      where: {
        route_short_name: name
      },
      select: {
        route_id: true,
        date: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    const [{ total_count, avg_dep, avg_arr, avg_added, trips }]: {
      total_count: bigint;
      avg_dep: number;
      avg_arr: number;
      avg_added: number;
      trips: bigint;
    }[] =
      await prisma.$queryRaw`select count(*)                                                       as total_count,
       count(distinct trip_id + start_date) as trips,
                                        avg(departure_delay)                                           as avg_dep,
                                        avg(arrival_delay)                                             as avg_arr,
                                        avg(coalesce(departure_delay, 0) - coalesce(arrival_delay, 0)) as avg_added
                                 from "StopDelay" SD
                                 
                                 where SD.route_id = ${route_id};`;

    const { trip_id, trip_headsign } = await prisma.trip.findFirstOrThrow({
      where: {
        route_id,
        date
      },
      select: {
        trip_id: true,
        trip_headsign: true
      }
    });

    const stopTimes = await prisma.stopTime.findMany({
      where: {
        trip_id,
        date
      },
      select: {
        stop_id: true
      }
    });

    const stops = await prisma.stop.findMany({
      where: {
        stop_id: {
          in: stopTimes.map((s) => s.stop_id)
        },
        date
      },
      select: {
        stop_id: true,
        stop_name: true,
        stop_lon: true,
        stop_lat: true
      }
    });

    return {
      name,
      total_count: Number(total_count),
      trips: Number(trips),
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
