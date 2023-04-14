<script setup lang="ts">
import { useFetch, useRoute } from '#imports';
import Route from '~/components/Route.vue';

const route = useRoute();
const { name } = route.params;

useSeoMeta({
  title: `Linie - ${name}`
});

const { data, error } = await useFetch(`/api/route/${name}`);
</script>

<template>
  <div v-if="error" class="text-center">
    <h1 class="text-3xl">Not found!</h1>
    <p>{{ error.data?.message || error.statusMessage }}</p>
  </div>
  <div v-if="data" class="flex justify-between max-h-full">
    <div class="flex flex-col gap-2 flex-grow">
      <h1 class="text-3xl mb-4">{{ name }}</h1>
      <h2 class="text-xl">Count: {{ data.total_count }}</h2>
      <h2 class="text-xl">Routes:</h2>
      <!--      <div class="flex flex-wrap w-96 gap-2">-->
      <!--        <Route v-for="route in data.routes" :options="route" />-->
      <!--      </div>-->
      <h2 class="text-xl">Avg Added: {{ data.avg_added }}</h2>
      <h2 class="text-xl">Avg Arrival: {{ data.avg_arr }}</h2>
      <h2 class="text-xl">Avg Departure: {{ data.avg_dep }}</h2>

      <Line
        :lat-lngs="
          data.stops.map(({ stop_lat, stop_lon }) => [stop_lat, stop_lon])
        "
      />
    </div>
    <Table
      :data="data.stops"
      :cols="['stop_name']"
      @click="navigateTo(`/station/${$event.stop_name}`)"
    >
      <template #col-stop_name><th>Stop</th></template>
    </Table>
  </div>
</template>

<style scoped></style>
