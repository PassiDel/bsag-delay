<script setup lang="ts"></script>

<template>
  <main>
    <slot />
  </main>
</template>

<style scoped>
main {
  @apply top-16 bottom-[47px] my-4 absolute w-[80%] bg-gray-200 p-8 rounded mx-[10%] overflow-y-auto;
}
</style>
