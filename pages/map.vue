<script setup lang="ts">
import { LCircle, LCircleMarker, LMap, LMarker, LTileLayer, LTooltip } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { clamp, lerpColor, colors } from "~/utils/hex";
import { ref, useFetch } from "#imports";

definePageMeta({
  layout: "full"
});
useSeoMeta({
  title: "Map"
});

const zoom = 14;

const { data } = await useFetch("/api/");

const saveData = data.value!!;
const toggle = ref(true);

function calculateMarkerOptions(marker: {
  stop_name: string,
  avg: number,
  count: number,
  stop_lat: string,
  stop_lon: string
}, t: boolean) {
  const percent = -t * (marker.avg) / data.value!!.boxValues.avg.q3;
  return {
    opacity: 0,
    fillColor: percent > 0 ? lerpColor(colors.green, colors.red, clamp(0, 1, percent)) : lerpColor(colors.green, colors.yellow, clamp(0, 1, -percent)),
    fillOpacity: 0.5,
    radius: 50 * marker.count / data.value!!.maxCount
  };
}

const log = console.log;
</script>

<template>
  <h1>map</h1>
  <button @click="toggle = !toggle">click</button>
  <div style="height:600px; width:100vw">
    <l-map ref="map" v-model:zoom="zoom" :center="[53.0755145,8.8058536]" :useGlobalLeaflet="false">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
        attribution="OpenStreetMap Mitwirkende"
      ></l-tile-layer>
      <l-circle-marker v-for="marker in data!!.data"
                       :options="calculateMarkerOptions(marker, toggle)"
                       :key="`${toggle}-${marker.stop_name}`"
                       :lat-lng="[parseFloat(marker.stop_lat), parseFloat(marker.stop_lon)]"
                       @click="navigateTo(`/station/${marker.stop_name}`)"
      >
        <l-tooltip :options="{direction: 'top'}">
          <h3>{{ marker.stop_name }}</h3>
          <ul>
            <li>Count: {{ marker.count }}</li>
            <li>Avg: {{ (marker.avg / 60).toFixed(2) }}s</li>
          </ul>
        </l-tooltip>
      </l-circle-marker>
    </l-map>
  </div>
</template>

<style>
body {
    margin: 0;
    overflow-x: hidden;
}
</style>