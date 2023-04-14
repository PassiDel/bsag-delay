<script setup lang="ts">
import { capitalize } from '~/utils/hex';

const { data, cols } = defineProps<{
  data: Record<string, any>[];
  cols: string[];
}>();

const emit = defineEmits<{
  (e: 'click', id: (typeof data)[0]): void;
}>();
</script>

<template>
  <div class="overflow-y-auto">
    <table class="w-full">
      <thead class="sticky top-0 bg-gray-600 text-gray-50">
        <tr class="h-12">
          <slot v-for="col in cols" :name="`col-${col}`">
            <th>{{ capitalize(col) }}</th></slot
          >
        </tr>
      </thead>
      <tbody class="overflow-y-auto">
        <tr
          v-for="row in data"
          class="text-center h-10 hover:bg-gray-400 bg-gray-300 transition-colors cursor-pointer"
          @click="emit('click', row)"
        >
          <slot :name="`row`" :row="row">
            <slot
              v-for="col in cols"
              :name="`cell-${col}`"
              :cell="row[col]"
              :row="row"
            >
              <td>{{ row[col] }}</td></slot
            >
          </slot>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
