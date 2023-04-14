<script setup lang="ts">
const { options } = defineProps<{
  options: {
    route_short_name: string;
    route_type: number;
    route_color: string;
    route_text_color: string;
  };
}>();
</script>

<template>
  <NuxtLink :to="`/route/${options.route_short_name}`">
    <span
      :style="`background-color: #${options.route_color || 'bbb'}; color: #${
        options.route_text_color || '000'
      };`"
      class="px-1 text-white hover:outline outline-black transition-all"
      :class="{
        'rounded-xl': options.route_type === 3
      }"
      >{{ options.route_short_name }}</span
    ></NuxtLink
  >
</template>

<style scoped></style>
