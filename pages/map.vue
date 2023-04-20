<script setup lang="ts">
import { LControl, LGeoJson, LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import { clamp, lerpColor, colors, hexToString } from '~/utils/hex';
import {
  ref,
  reactive,
  useLazyFetch,
  onBeforeMount,
  watch,
  useFetch
} from '#imports';
import { Feature, FeatureCollection, GeoJSON, Geometry } from 'geojson';
import { UnwrapRef } from 'vue';
import type { CircleMarker } from 'leaflet';
import { getDaysArray, getMonthArray } from '~/utils/days';
import SideControl from '~/components/SideControl.vue';

definePageMeta({
  layout: 'full'
});
useSeoMeta({
  title: 'Map'
});

const zoom = ref(14);

const { data: allStops } = await useFetch('/api/station/all');

const toggle = reactive({
  key: 'avg' as keyof StopData,
  time: 'all',
  week: '0',
  day: new Date(allStops.value!!.dates.min!!).toISOString().slice(0, 10),
  month: '2022-01-04',
  hour: '12'
});

const queryUri = computed(() => {
  const paths = [toggle.time];
  if (toggle.time === 'week') paths.push(toggle.week);
  if (toggle.time === 'day') paths.push(toggle.day);
  if (toggle.time === 'month') paths.push(toggle.month);
  if (toggle.time === 'hour') paths.push(toggle.hour);

  return paths.join('/');
});
const { data, pending } = await useLazyFetch(
  () => `/api/map/${queryUri.value}`
);
interface StopData {
  stop_name: string;

  count: number | undefined;
  avg: number | undefined;
  max_added: number | undefined;
  max_dep: number | undefined;
}

interface StopMarker {
  marker: CircleMarker | null;
  data: StopData | null;
}

const displayOptions = {
  key: [
    { key: 'avg', name: 'Relative Verspätung' },
    { key: 'count', name: 'Anzahl Fahrten' }
  ] as { key: keyof StopData; name: string }[],
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
  day: getDaysArray(
    allStops.value!!.dates.min!!,
    allStops.value!!.dates.max!!
  ).map((d) => ({ key: d.toISOString().slice(0, 10), name: d.toDateString() })),
  month: getMonthArray(
    allStops.value!!.dates.min!!,
    allStops.value!!.dates.max!!
  ).map((d) => ({
    key: d.toISOString().slice(0, 10),
    name: d.toLocaleString('de', { month: 'long', year: 'numeric' })
  })),
  hour: [...Array(24).keys()].map((i) => ({
    key: i.toString(),
    name: `${i.toString().padStart(2, '0')}:00`
  }))
};

const showOptionType = computed(() => {
  const options = ['key', 'time'];

  if (toggle.time === 'week') options.push('week');
  if (toggle.time === 'day') options.push('day');
  if (toggle.time === 'month') options.push('month');
  if (toggle.time === 'hour') options.push('hour');

  return options;
});

function calculateMarkerOptions(marker: StopData | null) {
  if (!marker || marker.count === undefined) {
    return {
      opacity: 0,
      fillOpacity: 0,
      fillColor: hexToString(0),
      radius: 0,
      attribution: 'VBN'
    };
  }
  const percent =
    Number(marker[toggle.key]) / data.value!!.boxValues.avg.median;
  return {
    opacity: 0,
    fillColor:
      percent > 0
        ? lerpColor(colors.green, colors.red, clamp(0, 1, percent))
        : lerpColor(colors.green, colors.yellow, clamp(0, 1, -percent)),
    fillOpacity: 0.5,
    radius: (50 * marker.count) / data.value!!.maxCount,
    attribution: 'VBN'
  };
}

type StopFeature = Feature<Geometry, StopMarker>;

const geojson: FeatureCollection<Geometry, StopMarker> = {
  type: 'FeatureCollection',
  features:
    allStops.value?.stops.map(
      (s) =>
        ({
          type: 'Feature',
          id: s.stop_name,
          geometry: {
            type: 'Point',
            coordinates: [
              parseFloat(s.stop_lon) || 0,
              parseFloat(s.stop_lat) || 0
            ]
          },
          properties: {
            marker: null,
            data: null
          }
        } as StopFeature)
    ) || []
};

const options = {
  pointToLayer: undefined as
    | ((feature: StopFeature, point: any) => any)
    | undefined
};

watch(
  data,
  (newData) => {
    if (!newData) return;
    console.log('newdata!');
    geojson.features.forEach((f) => {
      const data = newData.data.find((d) => f.id === d.stop_name) || null;

      f.properties.data = data;
      f.properties.marker?.setStyle(calculateMarkerOptions(data));
      f.properties.marker?.getTooltip()?.setContent(calculateTooltipContent(f));
    });
    console.log('updated');
  },
  { immediate: true }
);

watch(toggle, (_) => {
  geojson.features.forEach((f) => {
    f.properties.marker?.setStyle(calculateMarkerOptions(f.properties.data));
  });
});

function calculateTooltipContent(feature: StopFeature) {
  return `
<h3>${feature.id}</h3>
<p>Count: ${feature.properties.data?.count || 'n/a'}</p>
<p>Avg: ${feature.properties.data?.avg || 'n/a'}</p>
`;
}

onBeforeMount(async () => {
  // @ts-ignore
  const { circleMarker, LatLng } = await import('leaflet/dist/leaflet-src.esm');

  // And now the Leaflet circleMarker function can be used by the options:
  options.pointToLayer = (feature: StopFeature, latLng: typeof LatLng) => {
    const marker: CircleMarker = circleMarker(
      latLng,
      calculateMarkerOptions(feature.properties.data)
    ).bindTooltip(calculateTooltipContent(feature), { direction: 'top' });
    feature.properties.marker = marker;
    return marker;
  };
});

function selectOption(
  option: (typeof displayOptions)[keyof typeof displayOptions][0],
  key: keyof typeof displayOptions
) {
  toggle[key] = option.key as keyof StopData;
}
</script>

<template>
  <div style="height: 100%; width: 100vw">
    <l-map
      ref="map"
      v-model:zoom="zoom"
      :center="[53.0755145, 8.8058536]"
      :useGlobalLeaflet="false"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
        attribution="OpenStreetMap Mitwirkende"
      ></l-tile-layer>
      <l-geo-json :geojson="geojson" :options="options" />
      <SideControl
        :show-option-type="showOptionType"
        :display-options="displayOptions"
        :disabled="pending"
        :toggle="toggle"
        @select="selectOption"
      />
      <l-control position="bottomleft">
        <div class="flex flex-col gap-4 max-w-[40vw]">
          <div class="leaflet-bar bg-gray-300">
            <Table
              v-if="!pending"
              width="w-[300px]"
              nonclickable
              :data="
  Object.keys(data?.boxValues || {}).map((k) => ({
    key: k,
    ...data!!.boxValues[k]
  })) || []"
              :cols="['key', 'low', 'q1', 'median', 'q3', 'high']"
            />
          </div>
          <div class="leaflet-bar p-2 bg-gray-300">
            <h3>Histogram</h3>
          </div>
        </div>
      </l-control>
    </l-map>
  </div>
</template>

<style>
body {
  margin: 0;
  overflow-x: hidden;
}
</style>
