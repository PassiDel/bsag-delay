<script setup lang="ts">

import { capitalize } from "~/utils/hex";

const {data, cols} = defineProps<{
  data: Record<string, any>[],
  cols: string[]
}>()

const emit = defineEmits<{
  (e: 'click', id: typeof data[0]): void
}>()
</script>

<template>
  <div class="overflow-y-auto">
    <table class="w-full">
      <thead class="sticky top-0 bg-gray-600 text-gray-50">
      <tr class="h-12">
        <th v-for="col in cols">
          <slot :name="`col-${col}`">{{ capitalize(col) }}</slot>
        </th>
      </tr>
      </thead>
      <tbody class="overflow-y-auto">
      <tr v-for="row in data" class="text-center h-10 hover:bg-gray-400 bg-gray-300 transition-colors cursor-pointer">
        <slot :name="`row`" :row="row">
          <td v-for="col in cols" @click="emit('click', row)">
            <slot :name="`cell-${col}`" :cell="row[col]" :row="row">{{row[col]}}</slot>
          </td>
        </slot>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>