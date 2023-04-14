<script setup lang="ts">

import { LCircleMarker, LMap, LMarker, LTileLayer, LTooltip } from "@vue-leaflet/vue-leaflet";

const { latLng } = defineProps<{
  latLng: [number, number]
}>();
</script>

<template>
  <div class="w-64 h-64">
    <l-map ref="map" :zoom="16" :center="latLng" :useGlobalLeaflet="false">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
        attribution="OpenStreetMap Mitwirkende"
      ></l-tile-layer>
      <l-marker
        :lat-lng="latLng"
      >
      </l-marker>
    </l-map>
  </div>
</template>

<style scoped>

</style>