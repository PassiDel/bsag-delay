<script setup lang="ts"></script>

<template>
  <main>
    <slot />
  </main>
</template>

<style scoped>
main {
  @apply top-16 bottom-[47px] absolute w-screen bg-gray-200;
}
</style>
