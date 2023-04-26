<script setup lang="ts">
import { useFetch } from '#app';

useSeoMeta({
  title: 'Linien'
});

const { data } = await useFetch(() => `/api/route`);
</script>

<template>
  <div class="flex flex-col h-full gap-2">
    <h1 class="text-2xl">Linien</h1>
    <!--suppress TypeScriptValidateTypes -->
    <Table
      :data="data"
      :cols="['route_short_name']"
      @click="navigateTo(`/route/${$event.route_short_name}`)"
    >
      <template #col-route_short_name><th>Linie</th></template>
      <template #cell-route_short_name="{ row }"
        ><td><Route :options="row" /></td
      ></template>
    </Table>
  </div>
</template>

<style scoped></style>
