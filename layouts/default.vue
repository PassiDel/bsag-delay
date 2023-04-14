<script setup lang="ts"></script>

<template>
  <main>
    <slot />
  </main>
</template>

<style scoped>
main {
  @apply top-20 bottom-14 absolute w-[80%] bg-gray-200 p-8 rounded mx-[10%] overflow-y-auto;
}
</style>
