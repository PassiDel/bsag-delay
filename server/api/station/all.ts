import { prisma } from '~/server/prisma';

export default cachedEventHandler(async (_) => {
  const stops = await prisma.$queryRaw<
    {
      stop_name: string;
      stop_lat: string;
      stop_lon: string;
    }[]
  >`select S.stop_name as stop_name,
           S.stop_lat,
           S.stop_lon
    from "Stop" S
    where S.stop_name is not null
    group by S.stop_name, S.stop_lat, S.stop_lon
    order by S.stop_name`;

  const { _max, _min } = await prisma.stopDelay.aggregate({
    _max: {
      start_date: true
    },
    _min: {
      start_date: true
    }
  });
  return {
    stops,
    dates: {
      min: _min.start_date,
      max: _max.start_date
    }
  };
});
