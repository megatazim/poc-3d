<template>
  <div v-if="pieData.length" ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const chartRef = ref(null);
const pieData = ref([]);

onMounted(async () => {
  const SuperMap3D = window.SuperMap3D;

  const viewer = new SuperMap3D.Viewer("SuperMap3DContainer", {
    baseLayerPicker: false,
  });

  const scene = viewer.scene;

  // Load Gunatanah scene
  const gunatanahScene = await scene.open("http://localhost:8090/iserver/services/3D-Gunatanah-2/rest/realspace");

  // Example: count features by type
  const layer = scene.layers.getLayer(0); // or scene.layers.find('YourLayerName')
  const countMap = {};

  layer.getSelection().then((features) => {
    features.forEach((feature) => {
      const category = feature?.attributes?.type || 'Unknown';
      countMap[category] = (countMap[category] || 0) + 1;
    });

    pieData.value = Object.entries(countMap).map(([name, value]) => ({ name, value }));
    renderChart();
  });
});

function renderChart() {
  const chart = echarts.init(chartRef.value);

  chart.setOption({
    title: {
      text: 'Kategori Gunatanah',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Jenis',
        type: 'pie',
        radius: '60%',
        data: pieData.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  });
}
</script>
