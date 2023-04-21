<script setup lang="ts">
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import { useMapStore } from '~/stores/map';
import { storeToRefs } from 'pinia';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { histoData } = storeToRefs(useMapStore());

const chartData = ref<ChartData<'bar'>>({
  labels: [],
  datasets: [
    {
      label: histoData.value.title,
      backgroundColor: '#f87979',
      data: []
    }
  ]
});
onMounted(() => {
  watch(
    histoData,
    ({ data, buckets, title, colors }) => {
      if (data.length <= 0) return;
      const b = buckets || 1;
      const max = data.reduce((a, b) => Math.max(a, b), -Infinity);
      const min = data.reduce((a, b) => Math.min(a, b), Infinity);
      const x = [...Array(Math.ceil((max - min) / b)).keys()].map(
        (d) => d + Math.round(min / b)
      );
      const labels = x.map((x) => {
        if (b <= 1) return (x * b).toString();

        return `${(x - 1) * b} - ${x * b}`;
      });

      const dataset = x.map((i) =>
        data.reduce((a, d) => a + (d > (i - 1) * b && d <= i * b ? 1 : 0), 0)
      );

      chartData.value = {
        labels,
        datasets: [
          {
            label: title,
            backgroundColor: x.map(colors),
            data: dataset
          }
        ]
      };
    },
    { immediate: true, deep: true }
  );
});
</script>

<template>
  <div class="w-[20vw] h-[300px]">
    <ClientOnly>
      <Bar
        :data="chartData"
        :options="{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              display: true,
              label: 'Anzahl'
            }
          },
          y: {
            display: true,
            text: 'Sekunden'
          }
        }"
      />
    </ClientOnly>
  </div>
</template>

<style scoped></style>
