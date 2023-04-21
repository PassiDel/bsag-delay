<script setup lang="ts">
import { LControl, LGeoJson, LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import { clamp, colors, hexToString, lerpColor } from '~/utils/hex';
import { onBeforeMount, ref, useFetch, useLazyFetch, watch } from '#imports';
import { Feature, FeatureCollection, Geometry } from 'geojson';
import type { CircleMarker } from 'leaflet';
import SideControl from '~/components/SideControl.vue';
import { StopData, useMapStore } from '~/stores/map';

definePageMeta({
  layout: 'full'
});
useSeoMeta({
  title: 'Map'
});

const zoom = ref(14);

const { data: allStops } = await useFetch('/api/station/all');

const mapStore = useMapStore();
const { data, pending } = await useLazyFetch(
  () => `/api/map/${mapStore.queryUri}`
);

interface StopMarker {
  marker: CircleMarker | null;
  data: StopData | null;
}

mapStore.updateDates(allStops.value!!.dates);

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
  const key = mapStore.toggle.key;
  const median = data.value!!.boxValues[key].median;
  const percent = (Number(marker[key]) - median) / median;
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
    mapStore.updateData(newData);
    if (!newData) return;

    geojson.features.forEach((f) => {
      const data = newData.data.find((d) => f.id === d.stop_name) || null;

      f.properties.data = data;
      f.properties.marker?.setStyle(calculateMarkerOptions(data));
      f.properties.marker?.getTooltip()?.setContent(calculateTooltipContent(f));
    });
  },
  { immediate: true }
);

watch(mapStore.toggle, (_) => {
  geojson.features.forEach((f) => {
    f.properties.marker?.setStyle(calculateMarkerOptions(f.properties.data));
  });
});

function calculateTooltipContent(feature: StopFeature) {
  return `
<h3 class="text-2xl font-bold mb-2">${feature.id}</h3>
<div class="grid grid-cols-[min-content_1fr] gap-x-2 auto-rows-max">
<p>Anzahl:</p><p>${feature.properties.data?.count || 'n/a'}</p>
<p>Ø Relativ:</p><p>${feature.properties.data?.avg || 'n/a'} s</p>
<p>Ø Absolut:</p><p>${feature.properties.data?.dep || 'n/a'} s</p>
<p>Max Relativ:</p><p>${feature.properties.data?.max_added || 'n/a'} s</p>
<p>Max Absolut:</p><p>${feature.properties.data?.max_dep || 'n/a'} s</p>
</div>
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
      <SideControl :disabled="pending" />
      <l-control position="bottomleft" v-if="!pending">
        <div class="flex flex-col gap-4 max-w-[30vw]">
          <div class="leaflet-bar bg-gray-300">
            <Table
              v-if="!pending"
              nonclickable
              :data="
  Object.keys(data?.boxValues || {}).map((k) => ({
    key: k,
    ...data!!.boxValues[k]
  })) || []"
              :cols="['key', 'low', 'q1', 'median', 'q3', 'high']"
            />
          </div>
          <div class="leaflet-bar p-2 bg-gray-300 max-w-[30vw]">
            <Histogram />
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
