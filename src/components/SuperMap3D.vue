<script setup>
import { onMounted } from "vue";
import { settings } from "@/setting";

// 定义组件
const initViewer = () => {
  if (window.viewer) {
    window.viewer.destroy();
    window.viewer = null;
  }
  const viewer = new SuperMap3D.Viewer("SuperMap3DContainer", {
    // navigation: false,
    contextOptions: {
      contextType: Number(settings.SuperMap3DOptions.EngineType), // Webgl2:2 ; WebGPU:3
    },
  });
  window.viewer = viewer;
};

// 组件挂载时执行 initViewer 函数
onMounted(() => {
  try {
    initViewer();
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div id="SuperMap3DContainer"></div>
</template>

<style scoped>
#SuperMap3DContainer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
  font-family: sans-serif;
}
</style>
