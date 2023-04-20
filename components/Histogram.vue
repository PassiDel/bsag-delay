<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartData
} from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { data, buckets } = defineProps<{
  data: number[];
  buckets?: number;
}>();

const chartData = ref<ChartData<'bar'>>({
  labels: [],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: '#f87979',
      data: []
    }
  ]
});

const b = buckets || 1;
onMounted(() => {
  watch(
    () => data,
    (_) => {
      console.log('new data!');
      const max = data.reduce((a, b) => Math.max(a, b), -Infinity);
      const min = data.reduce((a, b) => Math.min(a, b), Infinity);
      const x = [...Array(Math.ceil((max - min) / b)).keys()].map(
        (d) => d + Math.round(min / b)
      );
      const labels = x.map((x) => (x * b).toString());

      console.log(
        x,
        labels,
        x.map((d) => (d - 1) * b)
      );
      const dataset = x.map((i) =>
        data.reduce((a, d) => a + (d > (i - 1) * b && d <= i * b ? 1 : 0), 0)
      );

      chartData.value = {
        labels,
        datasets: [
          {
            label: `Avg`,
            backgroundColor: x.map((d) => (d < 0 ? 'green' : 'red')),
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
            },
            y: {
              display: true,
              text: 'Sekunden'
            }
          }
        }"
      />
    </ClientOnly>
  </div>
</template>

<style scoped></style>
