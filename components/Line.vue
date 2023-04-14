<script setup lang="ts">
import {
  LCircleMarker,
  LMap,
  LMarker,
  LTileLayer,
  LTooltip
} from '@vue-leaflet/vue-leaflet';
import { onBeforeMount } from '#imports';

const { latLngs } = defineProps<{
  latLngs: [number, number][];
}>();

const map = ref(null);
const center = ref(null);

onBeforeMount(async () => {
  // @ts-ignore
  const { LatLngBounds } = await import('leaflet/dist/leaflet-src.esm');
  const bounds = new LatLngBounds(latLngs);

  center.value = bounds.getCenter();
  console.log(bounds.getCenter(), map.value);
  // map.value?.map?.fitBounds(bounds);
});
</script>

<template>
  <div class="w-full h-full">
    <l-map
      ref="map"
      :zoom="12"
      :center="[53.0897605, 8.826296]"
      :useGlobalLeaflet="false"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
        attribution="OpenStreetMap Mitwirkende"
      ></l-tile-layer>
      <l-marker v-for="latLng in latLngs" :lat-lng="latLng"> </l-marker>
    </l-map>
  </div>
</template>

<style scoped></style>
