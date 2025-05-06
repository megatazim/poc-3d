<script setup>
import { onMounted, ref } from "vue";

// import { settings } from "@/setting";


let viewer = null;
let layerCollection = ref([]);
let scenePosition = null;
let dock = false;
let table = null

// Get Imagery Provider
function getImageryProvider(type) {
  const SuperMap3D = window.SuperMap3D;

  switch (type) {
    case "mapbox-streets":
      return new SuperMap3D.UrlTemplateImageryProvider({
        url: "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWd0YXppbTA5IiwiYSI6ImNtMXlxZ3M5MTAwd2QycXEwNHVtMHFuc24ifQ.5La9-dzo1k6WCT3L5AqabA",
        tileWidth: 256,
        tileHeight: 256
      });
    case "mapbox-satellite":
      return new SuperMap3D.UrlTemplateImageryProvider({
        url: "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWd0YXppbTA5IiwiYSI6ImNtMXlxZ3M5MTAwd2QycXEwNHVtMHFuc24ifQ.5La9-dzo1k6WCT3L5AqabA",
        tileWidth: 256,
        tileHeight: 256
      });
    case "bing":
      return new SuperMap3D.BingMapsImageryProvider({
        url: "https://dev.virtualearth.net",
        mapStyle: SuperMap3D.BingMapStyle.AERIAL,
        key: "Aug_jpyeictKv9-blHjr00J0y-hYRR_5bIWhecGYlywC_F6p®LMvQ0Ye8J95tSJt"
      });
    default:
      return new SuperMap3D.UrlTemplateImageryProvider({
        url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        tilingScheme: new SuperMap3D.WebMercatorTilingScheme(),
        maximumLevel: 19
      });
  }
}

// Initialize Viewer
function initViewer(provider) {
  const SuperMap3D = window.SuperMap3D;

  if (viewer) {
    viewer.imageryLayers.removeAll();
    viewer.imageryLayers.addImageryProvider(provider);
    return;
  }

  viewer = new SuperMap3D.Viewer("SuperMap3DContainer", {
    imageryProvider: provider,
    baseLayerPicker: false,
    sceneMode: SuperMap3D.SceneMode.SCENE3D,
    terrainProvider: SuperMap3D.createWorldTerrain()
  });

const isLayerListVisible = ref(true);
function toggleLayerList() {
  isLayerListVisible.value = !isLayerListVisible.value;
}

const scene = viewer.scene;
const promise1 = scene.open("http://localhost:8090/iserver/services/3D-KLCC-2/rest/realspace")
const promise2 = scene.open("http://localhost:8090/iserver/services/3D-Gunatanah-2/rest/realspace");

SuperMap3D.when(promise1, function (layers1) {
  console.log("KLCC loaded");
  layerCollection.value = layers1;

  SuperMap3D.when(promise2, function (layers2) {
    console.log("Gunatanah loaded");
    layerCollection.value.push(...layers2); // Merge both layer sets
    updateLayerList();

    viewer.imageryLayers.addImageryProvider(provider);
    initPopup(viewer, scene);
    loadMultipleLayers(scene);
    document.getElementById("toolbar").style.display = "block";

  }, function (error2) {
    console.error("Failed to load Gunatanah scene:", error2);
  });

}, function (error1) {
  console.error("Failed to load KLCC scene:", error1);
});


  viewer.pickEvent.addEventListener(handleFeaturePick);

  const handler = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction((e) => {
    viewer.scene.pickPositionAsync(e.position).then((position) => {
      if (!position) return;
      const cartographic = SuperMap3D.Cartographic.fromCartesian(position);
      scenePosition = position; 
      addClapFeature({ 
        Longitude: SuperMap3D.Math.toDegrees(SuperMap3D.Cartographic.fromCartesian(position).longitude),
        Latitude: SuperMap3D.Math.toDegrees(SuperMap3D.Cartographic.fromCartesian(position).latitude),
        Height: SuperMap3D.Cartographic.fromCartesian(position).height.toFixed(2)
    });
      console.log({
        longitude: SuperMap3D.Math.toDegrees(cartographic.longitude),
        latitude: SuperMap3D.Math.toDegrees(cartographic.latitude),
        height: cartographic.height
      });
    });
  }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
  
}

// Update Layer List
function updateLayerList() {
  const layerItemsDiv = document.getElementById("layerItems");
  if (!layerItemsDiv) return;

  // Clear existing layer items
  layerItemsDiv.innerHTML = "";

  // Loop through each layer
  layerCollection.value.forEach((layer, index) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Use getVisible() if available, fallback to `visible`
    checkbox.checked = typeof layer.getVisible === 'function'
      ? layer.getVisible()
      : layer.visible;

    checkbox.id = `layer-${index}`;
    checkbox.onchange = () => {
      if (typeof layer.setVisible === 'function') {
        layer.setVisible(checkbox.checked);
      } else {
        layer.visible = checkbox.checked;
      }
    };

    // Rename input
    const input = document.createElement("input");
    input.type = "text";
    input.value = layer.name || `Layer ${index + 1}`;
    input.placeholder = "Rename layer";
    input.onchange = () => {
      layer.name = input.value;
      // Optional: update layer name in UI or label
    };

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.marginBottom = "8px";
    label.style.gap = "8px";

    label.appendChild(checkbox);
    label.appendChild(input);
    layerItemsDiv.appendChild(label);
  });
}

const isLayerListVisible = ref(true);

function toggleLayerList() {
  isLayerListVisible.value = !isLayerListVisible.value;
}


// Handle Feature Pick
function handleFeaturePick(feature) {
  const bubble = document.getElementById('bubble');
  if (bubble) bubble.style.display = "block";

  const table = document.getElementById("tab").querySelector("tbody");
  table.innerHTML = "";

  for (const key in feature) {
    if (Object.hasOwnProperty.call(feature, key)) {
      const row = table.insertRow();
      const cell1 = row.insertCell();
      const cell2 = row.insertCell();
      cell1.innerHTML = key;
      cell2.innerHTML = feature[key];
    }
  }
}

// Switch Basemap
function onBasemapChange(event) {
  const provider = getImageryProvider(event.target.value);
  initViewer(provider);
}

// Toggle Bubble
function toggleBubblePosition() {
  const bubble = document.getElementById('bubble');
  const tableContainer = document.getElementById('tableContainer');
  const button = document.getElementById('bubblePosition');

  if (bubble.classList.contains('float')) {
    bubble.classList.remove('float');
    bubble.classList.add('bubble');
    button.textContent = "Popup";
    tableContainer.style.height = "150px";
  } else {
    bubble.classList.remove('bubble');
    bubble.classList.add('float');
    button.textContent = "Side";
    bubble.style.left = "82%";
    bubble.style.bottom = "45%";
    tableContainer.style.height = "350px";
  }
}

// Reset Camera View
function resetCamera() {
  if (viewer) {
    viewer.scene.camera.flyToBoundingSphere(
      new SuperMap3D.BoundingSphere(
        SuperMap3D.Cartesian3.fromDegrees(101.711980, 3.157764, 100), // Center point
        1000 // Radius large enough to cover both KLCC and Gunatanah
      ), {
        offset: new SuperMap3D.HeadingPitchRange(0, -0.5, 1500)
      }
    );
  }
}


function initPopup(viewer, scene) {
  table = document.getElementById("tab").querySelector("tbody");
  let dock = false;

  document.getElementById("bubblePosition").onclick = () => {
    dock = !dock;
    const bubble = document.getElementById("bubble");
    if (bubble.classList.contains("bubble")) {
      bubble.classList.remove("bubble");
      //bubble.classList.add("float");
      // bubble.style.left = '82%';
      // bubble.style.bottom = '45%';
      document.getElementById("tableContainer").style.height = "350px";
    } else {
      bubble.classList.remove("float");
      bubble.classList.add("bubble");
      document.getElementById("tableContainer").style.height = "150px";
    }
  };

  document.getElementById("close").onclick = () => {
    document.getElementById("bubble").style.display = "none";
  };

  scene.postRender.addEventListener(() => {
    if (scenePosition && !dock) {
      const windowPosition = SuperMap3D.SceneTransforms.wgs84ToWindowCoordinates(scene, scenePosition);
      const bubble = document.getElementById("bubble");
      bubble.style.bottom = (scene.canvas.height - windowPosition.y + 45) + 'px';
      bubble.style.left = (windowPosition.x - 70) + 'px';
      bubble.style.visibility = "visible";
    }
  });
}

function addClapFeature(info) {
  const tbody = document.getElementById("tab").querySelector("tbody");
  tbody.innerHTML = '';
  for (const key in info) {
    const row = tbody.insertRow();
    row.insertCell().innerText = key;
    row.insertCell().innerText = info[key];
  }
  document.getElementById("bubble").style.display = "block";
}

onMounted(() => {
  const provider = getImageryProvider("osm");
  initViewer(provider);

  // Once viewer is initialized
  viewer.scene.open("http://localhost:8090/iserver/services/3D-GTC/rest/realspace").then(() => {
    loadMultipleLayers(viewer.scene);
    $("#toolbar").show();
  });
});

function loadMultipleLayers(scene) {
  const SuperMap3D = window.SuperMap3D;

  const promises = [
    scene.addS3MTilesLayerByScp(URL_CONFIG.SCENE_GTC_GROUND, { name: "ground" }),
    scene.addS3MTilesLayerByScp(URL_CONFIG.SCENE_GTC_BUILDIBG, { name: "original" }),
    scene.addS3MTilesLayerByScp(URL_CONFIG.SCENE_GTC_UNIT9, { name: "Building No.9" }),
    scene.addS3MTilesLayerByScp(URL_CONFIG.SCENE_GTC_HILL, { name: "hill" }),
  ];

  SuperMap3D.when.all(promises, (layers) => {
    viewer.scene.camera.setView({
      destination: SuperMap3D.Cartesian3.fromDegrees(115.000225758308630, 39.009956534844858, 500),
      orientation: { heading: 1.705646, pitch: -0.499956, roll: 0.0 },
    });

    // Optional: perform initial object visibility or post-load setup
    const original = scene.layers.find("original");
    if (original) {
      original.setObjsVisible([47], false);
    }
  });
}

function runServiceAreaAnalysis() {
  // Copy overlayBuildingBuffer() here, replace DOM with Vue-friendly logic
  // You can extract it to another function like `overlayBuildingBuffer(viewer, scene)`
}

const layerItemsRef = ref(null);



</script>

<template>
  <div id="mainContainer">
    <!-- Basemap Switcher -->
    <div id="basemapSwitcher"style="margin-bottom: 80px;">
      <label for="basemap"><strong>Basemap:</strong></label>
      <select id="basemap" @change="onBasemapChange">
        <option value="osm">OpenStreetMap</option>
        <option value="mapbox-streets">Mapbox Streets</option>
        <option value="mapbox-satellite">Mapbox Satellite</option>
        <option value="bing">Bing Maps Aerial</option>
      </select>
    </div>

    <!-- Layer List -->
      <div id="layerList" v-show="isLayerListVisible">
    <div class="layer-header">
      <span class="layer-title">Layers</span>
      <button id="hideLayerListBtn" @click="toggleLayerList" title="Hide">✖</button>
    </div>
    <div id="layerItems"></div>
  </div>

  <!-- Show Button (when hidden) -->
  <button v-show="!isLayerListVisible" id="toggleLayerListFloating" @click="toggleLayerList">
    Show Layers
  </button>
    <!-- Reset View Button -->
    <div id="resetButton">
      <button @click="resetCamera">🔄</button>
    </div>
    
    <!-- SuperMap 3D Container -->
    <div id="SuperMap3DContainer" class="viewer-container"></div>
  </div>

  <!-- Toolbar buttons -->
<div id="toolbar" style="position: absolute; top: 5px; left: 10px; display: none; z-index: 1000;">
  <button id="linearExtrude" @click="runServiceAreaAnalysis">Service Area Analysis</button>
  <button id="reset" @click="resetScene">Reset</button>
</div>

<!-- ECharts graph container -->
<div id="GTC" style="display: none; position: absolute; top: 60px; left: 10px; background: rgba(38,38,38,0.5); z-index: 1000;">
  <div style="padding: 10px">
    <div class="ui piled segment">
      <div id="graph" style="width: 300px; height: 250px;"></div>
    </div>
  </div>
</div>

<div id="mainContainer">

<!-- Pie Chart Component -->
<div id="pieChartContainer" v-if="showChart">
      <Piechart :chartData="chartData" />
    </div>
  </div>
  

  <div id="bubble" class="bubble" style="bottom:0;left:82%;display:none;">
  <div id="tools" style="text-align:right">
    <span style="color: rgb(95, 74, 121);padding: 5px;position: absolute;left: 10px;top: 4px;">Object Info</span>
    <span class="fui-export" id="bubblePosition" style="color: darkgrey; padding:5px" title="Dock"></span>
    <span class="fui-cross" title="Close" id="close" style="color: darkgrey;padding:5px"></span>
  </div>
  <div style="overflow-y:scroll;height:150px" id="tableContainer">
    <table id="tab"><tbody></tbody></table>
  </div>
</div>

</template>

<style scoped>

html, body {
  position: absolute;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#mainContainer {
  position: relative;
}

#SuperMap3DContainer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
}

#basemapSwitcher, #resetButton {
  position: absolute;
  left: 10px;
  background-color: #596969;
  color: rgb(255, 255, 255);
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0);
  width: 100px;
  z-index: 1000; /* ✅ higher than 3D map */
}

#basemapSwitcher { top: 10px;
  max-height: 900px; 
  overflow-y: auto;
  white-space: nowrap; 
  width: 200px; 
}

#layerList {
  position: absolute;
  top: 60px;
  left: 10px;
  background-color: rgba(38, 38, 38, 0.85);
  padding: 12px 16px;
  border-radius: 6px;
  z-index: 1000;
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  color: white;
}

.layer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.layer-title {
  font-size: 14px;
  font-weight: bold;
  color: white;
}

#hideLayerListBtn {
  background: transparent;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 0 6px;
  line-height: 1;
}

#toggleLayerListFloating {
  position: absolute;
  top: 60px;
  left: 10px;
  background-color: #596969;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  width: 150px;
  z-index: 900;

  /* white-space: nowrap; ✅ Prevent text wrapping */
  font-size: 14px;
  font-weight: 500;
}

#resetButton { 
  top: 10px; /* move it lower than basemapSwitcher */
  left: 160px;
  background-color: rgba(0, 0, 0, 0);
  color: rgb(0, 0, 0);
  padding: 10px 50px;
  border-radius: 4px;
  font-size: 14px;
  box-shadow: none;
  width: 80px;
  z-index: 1000;
 }

#bubble {
  position: fixed;
  top: 80%;
  left: 100%;
  background: white;
  padding: 100px;
  border-radius: 8px;
  display: none;
  color: rgb(0, 0, 0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  z-index: 1001; 
}

.float {
  position: fixed;
  left: 92%;
  bottom: 45%;
}

#tableContainer {
  max-height: 700px;
  overflow-y: auto;
  border: 1px solid #ccc;
  background: white;
  padding: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  font-size: 14px;
}


.float {
  position: left;
  left: 82%;
  bottom: 55%;
}

#tableContainer {
  max-height: 100px;
  position: relative;
  /* overflow-y: auto; */
  border: 2px solid #ccc;
  background: white;
  padding: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  font-size: 14px;
}

#layerList button {
  background-color: #07AFA7;
  color: white;
  border: none;
  border-radius: 2px;
  padding: 3px 10px;
  cursor: pointer;
}
</style>
