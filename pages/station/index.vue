<script setup lang="ts">
import { useFetch } from '#app';
import Pagination from '~/components/Pagination.vue';

useSeoMeta({
  title: 'Stations'
});

const page = ref(1);

const { data, pending } = await useFetch(
  () => `/api/station?page=${page.value}`
);
</script>

<template>
  <Loading :show="pending" />
  <div class="flex flex-col h-full gap-2">
    <h1 class="text-2xl">Stationen</h1>
    <!--suppress TypeScriptValidateTypes -->
    <Table
      :data="data.data"
      :cols="['name', 'count', 'avg']"
      @click="navigateTo(`/station/${$event.name}`)"
    >
      <template #col-count><th class="w-36">Count</th></template>
      <template #col-avg
        ><th class="text-end px-4 w-36">Avg Added (s)</th></template
      >
      <template #cell-avg="{ cell }"
        ><td class="text-end pr-4">{{ cell }}</td></template
      >
    </Table>
    <Pagination
      v-model:page="page"
      :pending="pending"
      :last-page="data.lastPage"
    />
  </div>
</template>

<style scoped></style>
