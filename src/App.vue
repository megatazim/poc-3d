<script setup>
import DPGN from "@/components/DPGN.vue"; // ✅ Correct path if DPGN.vue is inside /pages
import ViewshedAnalysis from "@/components/ViewshedAnalysis.vue";
import Piechart from "@/components/Piechart.vue";
</script>

<template>
  <DPGN />
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
