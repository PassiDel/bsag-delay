<script setup lang="ts">
import { LControl, LGeoJson, LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import { clamp, lerpColor, colors } from '~/utils/hex';
import { ref, reactive, useLazyFetch, onBeforeMount, watch } from '#imports';
import { Feature, FeatureCollection, GeoJSON, Geometry } from 'geojson';
import { UnwrapRef } from 'vue';
import type { CircleMarker } from 'leaflet';

definePageMeta({
  layout: 'full'
});
useSeoMeta({
  title: 'Map'
});

const zoom = ref(14);
const toggle = reactive({ key: 'avg' as keyof Stop, time: 'year' });

const queryParams = computed(() => {
  const params = new URLSearchParams();
  params.append('time', toggle.time);

  return params.toString();
});

const { data, pending } = await useLazyFetch(
  () => `/api/?${queryParams.value}`
);
interface Stop {
  stop_lon: string;
  stop_lat: string;
  stop_name: string;

  count: number;
  avg: number;
  max_added: number;
  max_dep: number;
}

interface StopWithMarker extends Stop {
  marker: CircleMarker | undefined;
}

const displayOptions = {
  key: [
    { key: 'avg', name: 'Relative Verspätung' },
    { key: 'count', name: 'Anzahl Fahrten' }
  ] as { key: keyof Stop; name: string }[],
  time: [
    { key: 'year', name: 'Jahr' },
    { key: 'month', name: 'Monat' },
    { key: 'week', name: 'Woche' },
    { key: 'day', name: 'Tag' }
  ]
};

function calculateMarkerOptions(marker: Stop) {
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

const log = console.log;

const geojson: FeatureCollection<Geometry, StopWithMarker> = reactive({
  type: 'FeatureCollection',
  features: []
});
type StopFeature = (typeof geojson.features)[0];

const options = reactive({
  pointToLayer: undefined as
    | ((feature: StopFeature, point: any) => any)
    | undefined
});

watch(geojson, () => {
  console.log('data change');
});

watch(
  data,
  (newData) => {
    if (!newData) return;
    console.log('newdata!');
    geojson.features.splice(0);
    geojson.features.push(
      ...newData.data.map(
        (d) =>
          ({
            type: 'Feature',
            id: d.stop_name,
            geometry: {
              type: 'Point',
              coordinates: [
                parseFloat(d.stop_lon) || 0,
                parseFloat(d.stop_lat) || 0
              ]
            },
            properties: d
          } as StopFeature)
      )
    );
  },
  { immediate: true }
);

watch(toggle, async (newValue, oldValue) => {
  geojson.features.forEach((f) => {
    f.properties.marker?.setStyle(calculateMarkerOptions(f.properties));
  });
});

onBeforeMount(async () => {
  // @ts-ignore
  const { circleMarker, LatLng } = await import('leaflet/dist/leaflet-src.esm');

  // And now the Leaflet circleMarker function can be used by the options:
  options.pointToLayer = (feature: StopFeature, latLng: typeof LatLng) => {
    const marker: CircleMarker = circleMarker(
      latLng,
      calculateMarkerOptions(feature.properties)
    ).bindTooltip(
      `          <h3>${feature.properties.stop_name}</h3>
                <ul>
                  <li>Count: ${feature.properties.count}</li>
                  <li>Avg: ${(feature.properties.avg / 60).toFixed(2)}s</li>
                </ul>`,
      { direction: 'top' }
    );
    feature.properties.marker = marker;
    return marker;
  };
});

function selectOption(
  option: (typeof displayOptions)[keyof typeof displayOptions][0],
  key: keyof typeof displayOptions
) {
  switch (key) {
    case 'key':
      toggle.key = option.key as keyof Stop;
      break;
    case 'time':
      toggle.time = option.key;
      break;
  }
}
</script>

<template>
  <h1>map</h1>
  <input v-model="toggle" />
  <p v-if="!pending">{{ data.boxValues.avg }}</p>
  <div style="height: 600px; width: 100vw">
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
      <l-control position="topright">
        <div class="w-32 flex flex-col gap-8">
          <div
            class="flex leaflet-bar flex-col divide-y-2 divide-gray-500"
            v-for="optionType in Object.keys(displayOptions)"
          >
            <div v-for="option in displayOptions[optionType]">
              <button
                :disabled="pending"
                class="p-2 bg-gray-300 disabled:bg-gray-100 hover:bg-gray-600 disabled:hover:bg-gray-100 text-black disabled:text-gray-600 transition-colors w-full"
                :class="{
                  ['bg-gray-400 disabled:bg-gray-300 disabled:hover:bg-gray-300']:
                    option.key === toggle[optionType]
                }"
                @click="
                  selectOption(
                    option,
                    optionType as keyof typeof displayOptions
                  )
                "
              >
                {{ option.name }}
              </button>
            </div>
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
