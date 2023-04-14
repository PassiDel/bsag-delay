<script setup lang="ts">

import {useFetch} from "#app";

useSeoMeta({
  title: "Stations",
});

const {data} = await useFetch('/api/station')

</script>

<template>
  <div class="flex flex-col h-full gap-2">
    <h1 class="text-2xl">Stationen</h1>
    <!--suppress TypeScriptValidateTypes -->
    <Table :data="data" :cols="['name', 'count', 'avg']" @click="navigateTo(`/station/${$event.name}`)">
    </Table>
  </div>

</template>

<style scoped>
</style>