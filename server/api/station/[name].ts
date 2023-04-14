import { prisma } from '~/server/prisma';
import { secondsToHuman } from '~/server/time';

export default cachedEventHandler(async (event) => {
  const { name: rawName } = event.context.params!!;

  const name = decodeURI(rawName);

  try {
    const { stop_lat, stop_lon } = await prisma.stop.findFirstOrThrow({
      where: {
        stop_name: name
      },
      select: {
        stop_lat: true,
        stop_lon: true
      }
    });

    const [{ total_count, avg_dep, avg_arr, avg_added }]: {
      total_count: bigint;
      avg_dep: number;
      avg_arr: number;
      avg_added: number;
    }[] =
      await prisma.$queryRaw`select count(*)                                                       as total_count,
                                        avg(departure_delay)                                           as avg_dep,
                                        avg(arrival_delay)                                             as avg_arr,
                                        avg(coalesce(departure_delay, 0) - coalesce(arrival_delay, 0)) as avg_added
                                 from "StopDelay" SD
                                          left join "Stop" S on SD.stop_id = S.stop_id and S.date = SD.date
                                 where S.stop_name = ${name};`;

    const routes: {
      route_short_name: string;
      route_type: number;
      route_color: string;
      route_text_color: string;
    }[] =
      await prisma.$queryRaw`select distinct R.route_short_name, R.route_type, R.route_color, R.route_text_color
from "StopDelay" SD
         left join "Stop" S on SD.stop_id = S.stop_id and S.date = SD.date
         left join "Route" R on SD.route_id = R.route_id and SD.date = R.date
where S.stop_name = ${name}
order by R.route_type, R.route_short_name;`;

    return {
      name,
      lat: parseFloat(stop_lat!!),
      lon: parseFloat(stop_lon!!),
      total_count: Number(total_count),
      avg_dep: secondsToHuman(avg_dep),
      avg_arr: secondsToHuman(avg_arr),
      avg_added: secondsToHuman(avg_added),
      routes
    };
  } catch (e) {
    console.error(name, e);
    throw createError({
      statusCode: 404,
      message: `Not found: "${name}"`
    });
  }
});
