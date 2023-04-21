<script setup lang="ts">
import { LMap, LMarker, LTileLayer, LTooltip } from '@vue-leaflet/vue-leaflet';

const { latLngs } = defineProps<{
  latLngs: { name: string; coords: [number, number] }[];
}>();

const onLoad = async (event: { fitBounds: (bounds: any) => void }) => {
  // @ts-ignore
  const { LatLngBounds } = await import('leaflet/dist/leaflet-src.esm');
  const bounds = new LatLngBounds(latLngs.map((l) => l.coords));

  event.fitBounds(bounds);
};
</script>

<template>
  <div class="w-full h-full">
    <l-map
      :zoom="12"
      :center="[53.0897605, 8.826296]"
      :useGlobalLeaflet="false"
      @ready="onLoad($event)"
      attribution="VBN"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
        attribution="OpenStreetMap Mitwirkende"
      ></l-tile-layer>
      <l-marker
        v-for="latLng in latLngs"
        :lat-lng="latLng.coords"
        attribution="VBN"
      >
        <LTooltip :options="{ direction: 'top' }">
          <h3>{{ latLng.name }}</h3>
        </LTooltip>
      </l-marker>
    </l-map>
  </div>
</template>

<style scoped></style>
