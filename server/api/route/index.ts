import { prisma } from '~/server/prisma';
import { defineEventHandler, getQuery } from 'h3';
import { secondsToHuman } from '~/server/time';

export default defineEventHandler(async (event) => {
  const routes = await prisma.$queryRaw<
    {
      route_short_name: string;
      route_type: number;
      route_color: string;
      route_text_color: string;
    }[]
  >`select distinct R.route_short_name, R.route_type, R.route_color, R.route_text_color
    from "StopDelay" SD
             left join "Route" R on SD.route_id = R.route_id and SD.date = R.date
    order by R.route_type, R.route_short_name
  `;

  return routes;
});
