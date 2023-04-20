<script setup lang="ts">
import { LControl } from '@vue-leaflet/vue-leaflet';

const { showOptionType, displayOptions, disabled, toggle } = defineProps<{
  showOptionType: string[];
  displayOptions: {
    [key: string]: {
      key: string;
      name: string;
    }[];
  };
  disabled: boolean;
  toggle: {
    [a: keyof typeof displayOptions]: string;
  };
}>();

const emit = defineEmits<{
  (
    e: 'select',
    option: (typeof displayOptions)[keyof typeof displayOptions][0],
    key: keyof typeof displayOptions
  ): void;
}>();
const { log } = console;
</script>

<template>
  <l-control position="topright">
    <div class="w-32 flex flex-col gap-8">
      <div
        class="flex leaflet-bar flex-col divide-y-2 divide-gray-500"
        v-for="optionType in showOptionType"
      >
        <div
          v-if="displayOptions[optionType].length <= 7"
          v-for="option in displayOptions[optionType]"
        >
          <button
            :disabled="disabled"
            class="p-2 bg-gray-300 disabled:bg-gray-100 hover:bg-gray-600 disabled:hover:bg-gray-100 text-black disabled:text-gray-600 transition-colors w-full"
            :class="{
              ['bg-gray-400 disabled:bg-gray-300 disabled:hover:bg-gray-300']:
                option.key === toggle[optionType]
            }"
            @click="
              emit('select', option, optionType as keyof typeof displayOptions)
            "
          >
            {{ option.name }}
          </button>
        </div>
        <div v-else>
          <select
            @input="
              emit(
                'select',
                displayOptions[optionType].find(
                  (k) => k.key === $event.target.value
                ),
                optionType
              )
            "
            class="p-2 bg-gray-300 disabled:bg-gray-100 text-black disabled:text-gray-600 transition-colors w-full"
          >
            <option
              class="text-right"
              :disabled="disabled"
              v-for="option in displayOptions[optionType]"
              :value="option.key"
              :selected="option.key === toggle[optionType]"
            >
              {{ option.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </l-control>
</template>

<style scoped></style>
