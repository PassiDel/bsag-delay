import { defineStore } from 'pinia';
import { getDaysArray, getMonthArray } from '~/utils/days';

type Option = { key: string; name: string };

export interface StopData {
  stop_name: string;

  count: number | undefined;
  avg: number | undefined;
  max_added: number | undefined;
  max_dep: number | undefined;
  dep: number | undefined;
}

type MapData = {
  data: StopData[];
  maxCount: number;
  boxValues: {
    avg: {
      low: number;
      q1: number;
      median: number;
      q3: number;
      high: number;
    };
    count: {
      low: number;
      q1: number;
      median: number;
      q3: number;
      high: number;
    };
  };
};
export const useMapStore = defineStore('map', {
  state: () => ({
    displayOptions: {
      key: [
        { key: 'avg', name: 'Relative Verspätung', buckets: 10 },
        { key: 'dep', name: 'Absolute Verspätung', buckets: 10 },
        { key: 'count', name: 'Anzahl Fahrten', buckets: 100 },
        { key: 'max_added', name: 'Max relativ', buckets: 5 * 60 },
        { key: 'max_dep', name: 'Max Absolut', buckets: 5 * 60 }
      ] as { key: 'count' | 'avg' | 'dep'; name: string; buckets: number }[],
      time: [
        { key: 'all', name: 'Alles' },
        { key: 'month', name: 'Monat' },
        { key: 'week', name: 'Wochentag' },
        { key: 'day', name: 'Tag' },
        { key: 'hour', name: 'Stunde' }
      ],
      week: [
        'Sonntag',
        'Montag',
        'Dienstag',
        'Mittwoch',
        'Donnerstag',
        'Freitag',
        'Samstag'
      ].map((d, i) => ({
        key: i.toString(),
        name: d
      })),
      day: [] as Option[],
      month: [] as Option[],
      hour: [...Array(24).keys()].map((i) => ({
        key: i.toString(),
        name: `${i.toString().padStart(2, '0')}:00`
      }))
    },
    toggle: {
      key: 'avg' as 'count' | 'avg',
      time: 'all',
      week: '0',
      day: '2022-01-04',
      month: '2022-01-04',
      hour: '12'
    },
    data: null as MapData | null
  }),
  actions: {
    updateData(data: MapData | null) {
      this.data = data;
      const key = this.displayOptions.key.find((o) => o.key === 'count')!!;
      const buckets = (data?.maxCount || 1000) / 10;
      key.buckets = Math.ceil(buckets / 100) * 100;
    },
    updateDates({ min, max }: { min: string | null; max: string | null }) {
      if (!min || !max) return;
      this.displayOptions.day.splice(0);
      this.displayOptions.month.splice(0);

      this.toggle.day = new Date(min).toISOString().slice(0, 10);
      this.displayOptions.day.push(
        ...getDaysArray(min, max).map((d) => ({
          key: d.toISOString().slice(0, 10),
          name: d.toDateString()
        }))
      );
      this.displayOptions.month.push(
        ...getMonthArray(min, max).map((d) => ({
          key: d.toISOString().slice(0, 10),
          name: d.toLocaleString('de', { month: 'long', year: 'numeric' })
        }))
      );
    }
  },
  getters: {
    queryUri: ({ toggle }) => {
      const paths = [toggle.time];
      if (toggle.time === 'week') paths.push(toggle.week);
      if (toggle.time === 'day') paths.push(toggle.day);
      if (toggle.time === 'month') paths.push(toggle.month);
      if (toggle.time === 'hour') paths.push(toggle.hour);

      return paths.join('/');
    },
    showOptionType: ({ toggle }) => {
      const options = ['key', 'time'];

      if (toggle.time === 'week') options.push('week');
      if (toggle.time === 'day') options.push('day');
      if (toggle.time === 'month') options.push('month');
      if (toggle.time === 'hour') options.push('hour');

      return options;
    },
    histoData: ({ data, toggle, displayOptions }) => {
      const { key, name, buckets } = displayOptions.key.find(
        (o) => o.key === toggle.key
      )!;
      const colors = () => 'green';
      if (!data) {
        return {
          data: [] as number[],
          title: name,
          buckets,
          colors
        };
      }

      const nums = data.data.map((d) => d[key] as number) || [];
      return {
        data: nums,
        title: name,
        buckets,
        colors:
          key === 'count' ? colors : (d: number) => (d < 0 ? 'green' : 'red')
      };
    }
  }
});
