import { prisma } from '~/server/prisma';

export default cachedEventHandler(async () => {
  return await prisma.$queryRaw<
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
});
