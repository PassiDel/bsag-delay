<script setup lang="ts">
import Punctual from '~/components/Punctual.vue';

useSeoMeta({
  title: `Stats`
});

const { data } = await useFetch('/api/stats');
const percent = computed(() => {
  if (!data.value) return 0;

  const sum = data.value.reduce(
    (a, c) => ({ total: a.total + c.total + c.min + c.db, db: a.db + c.db }),
    { total: 0, db: 0 }
  );

  return 100 - 100 * (sum.db / sum.total);
});
</script>

<template>
  <div class="bg-gray-300 p-4 outline outline-gray-400 rounded">
    <h2 class="text-2xl mb-2">Wie pünktlich ist die BSAG?</h2>
    <h3 class="text-xl mb-8">Durchschnittlich {{ percent.toFixed(2) }}%!</h3>
    <Punctual :data="data" />
  </div>
</template>

<style scoped></style>
