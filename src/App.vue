<script setup>
import SuperMap3D from "@/components/SuperMap3D.vue";
import ViewshedAnalysis from "@/components/ViewshedAnalysis.vue";
import Piechart from "@/components/Piechart.vue";
</script>

<template>
  <SuperMap3D />
  <ViewshedAnalysis />
  <Piechart/>
</template>

<style scoped>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: fixed
}
</style>
