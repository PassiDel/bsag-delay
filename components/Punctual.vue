<script setup lang="ts">
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'vue-chartjs';
import 'chartjs-adapter-moment';

ChartJS.register(...registerables);

const { data } = defineProps<{
  data: { date: Date; total: number; min: number; db: number; perc: number }[];
}>();

const lineData = ref({
  datasets: [
    {
      label: '< 1 min',
      backgroundColor: hexToString(colors.green),
      data,
      parsing: {
        xAxisKey: 'date',
        yAxisKey: 'total'
      },
      order: 1,
      yAxisID: 'y'
    },
    {
      label: '> 1min',
      backgroundColor: hexToString(colors.yellow),
      data,
      parsing: {
        xAxisKey: 'date',
        yAxisKey: 'min'
      },
      order: 1,
      yAxisID: 'y'
    },
    {
      label: '> 5min',
      backgroundColor: hexToString(colors.red),
      data,
      parsing: {
        xAxisKey: 'date',
        yAxisKey: 'db'
      },
      order: 1,
      yAxisID: 'y'
    },
    {
      label: '% Pünktlich',
      backgroundColor: 'black',
      data,
      parsing: {
        xAxisKey: 'date',
        yAxisKey: 'perc'
      },
      type: 'line',
      order: 0,
      yAxisID: 'y1'
    }
  ]
});

const options: ChartOptions<'line'> = {
  responsive: true,
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
        displayFormats: {
          day: 'dd DD.MM'
        },
        tooltipFormat: 'dd DD.MM.YYYY'
      },
      stacked: true
    },
    y: {
      stacked: true
    },
    y1: {
      grid: {
        drawOnChartArea: false // only want the grid lines for one axis to show up
      },
      position: 'right',
      type: 'linear',
      max: 100,
      min: 0
    }
  }
};
</script>

<template>
  <div class="w-full h-full">
    <ClientOnly>
      <Bar :data="lineData" :options="options" />
    </ClientOnly>
  </div>
</template>

<style scoped></style>
