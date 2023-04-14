<script setup lang="ts">
const { page, pending, lastPage } = defineProps<{
  page: number;
  pending?: boolean;
  lastPage?: number;
}>();

const _page = ref(page);
const emit = defineEmits<{
  (e: 'update:page', value: number): void;
}>();

const select = (p: number) => {
  emit('update:page', p);
};

const buttons = (value: number) => {
  const from1 = value - Math.round(5 / 2) + 1;
  const from2 = (lastPage || 1) + 1 - 5;
  const from = Math.max(Math.min(from1, from2), 1);

  const to = Math.min(from + 5 - 1, lastPage || 1);

  return Array.from({ length: to - from + 1 }, (v, k) => k + from);
};
</script>

<template>
  <ul class="table border-collapse text-center bg-white mx-auto shadow-sm">
    <li class="arrow-li">
      <button
        :disabled="page <= 1 || pending"
        @click="select(1)"
        class="arrow-button"
      >
        «
      </button>
    </li>
    <li class="arrow-li">
      <button
        :disabled="page <= 1 || pending"
        @click="select(page - 1)"
        class="arrow-button"
      >
        ‹
      </button>
    </li>
    <li
      v-for="i in buttons(page)"
      :class="{ ['border-blue-500 hover:border-blue-600']: page === i }"
      class="arrow-li"
    >
      <button
        @click="select(i)"
        :disabled="pending"
        :class="{ ['bg-blue-500 text-white hover:bg-blue-600']: page === i }"
        class="hover:bg-blue-100 w-full h-full disabled:hover:bg-white disabled:text-gray-400 disabled:cursor-not-allowed transition duration-100 ease-in-out focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50"
      >
        {{ i }}
      </button>
    </li>
    <li class="arrow-li">
      <button
        :disabled="page - 1 >= lastPage || pending"
        @click="select(page + 1)"
        class="arrow-button"
      >
        ›
      </button>
    </li>
    <li class="arrow-li">
      <button
        :disabled="page - 1 >= lastPage || pending"
        @click="select(lastPage || 1)"
        class="arrow-button"
      >
        »
      </button>
    </li>
  </ul>
</template>

<style scoped>
.arrow-button {
  @apply hover:bg-blue-100 disabled:hover:bg-white disabled:text-gray-400 w-full h-full transition duration-100 ease-in-out disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50;
}
.arrow-li {
  @apply w-8 h-8 border border-gray-200 table-cell hover:border-blue-100;
}
</style>
