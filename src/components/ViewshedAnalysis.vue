<template>
    <div id="mainContainer">
      <div id="SuperMap3DContainer"></div>

      <!-- Toolbar (with toggle button inside) -->
        <div id="toolbar" v-show="showToolbar" class="param-container tool-bar">
        <div class="toolbar-header">
            <span class="toolbar-title"> Toolbar</span>
            <button id="toggleToolbar" @click="showToolbar = false" title="Hide">✖</button>
        </div>

        <button @click="startViewshed">Start Viewshed</button>
        <button @click="drawClipRegion">Draw Clipping Region</button>
        <button @click="clearAnalysis">Clear</button>
        <div class="param-item">
            <b>Clipping Mode:</b>
            <select v-model="clipMode" @change="updateClipMode">
            <option value="keep-inside">Keep Inside</option>
            <option value="keep-outside">Keep Outside</option>
            </select>
        </div>
    </div>

        <!-- Button to reopen toolbar -->
        <button
        v-show="!showToolbar"
        id="toggleToolbarFloating"
        @click="showToolbar = true"
        >
        Viewshed3D
        </button>
  
      <!-- Settings Panel -->
      <div id="wrapper" v-show="showSettings">
        <div id="login" class="animate form">
          <span class="close" @click="showSettings = false">×</span>
          <form>
            <h1>Property Settings</h1>
            <div>
              <label>Direction (degrees)</label>
              <input type="range" min="0" max="360" step="1" v-model.number="direction" />
              <input type="number" v-model.number="direction" />
            </div>
            <div>
              <label>Pitch (degrees)</label>
              <input type="range" min="-90" max="90" step="1" v-model.number="pitch" />
              <input type="number" v-model.number="pitch" />
            </div>
            <div>
              <label>Distance (m)</label>
              <input type="range" min="1" max="500" step="1" v-model.number="distance" />
              <input type="number" v-model.number="distance" />
            </div>
            <div>
              <label>Horizontal FOV (degrees)</label>
              <input type="range" min="1" max="120" step="1" v-model.number="horizontalFov" />
              <input type="number" v-model.number="horizontalFov" />
            </div>
            <div>
              <label>Vertical FOV (degrees)</label>
              <input type="range" min="1" max="90" step="1" v-model.number="verticalFov" />
              <input type="number" v-model.number="verticalFov" />
            </div>
            <div>
              <label>Visible Area Color</label>
              <input type="color" v-model="visibleAreaColor" />
            </div>
            <div>
              <label>Invisible Area Color</label>
              <input type="color" v-model="invisibleAreaColor" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
   import { ref, onMounted, watch } from 'vue';
  
  let viewer = null;
  let scene = null;
  let viewshed3D = null;
  let pointHandler = null;
  let handlerPolygon = null;
  let viewPosition = null;
  
  const direction = ref(0);
  const showToolbar = ref(true);
  const pitch = ref(0);
  const distance = ref(100);
  const horizontalFov = ref(90);
  const verticalFov = ref(60);
  const visibleAreaColor = ref('#00ff00');
  const invisibleAreaColor = ref('#ff0000');
  const clipMode = ref('keep-inside');
  const showSettings = ref(false);
  onMounted(() => {
    const SuperMap3D = window.SuperMap3D;
  
    viewer = new SuperMap3D.Viewer('SuperMap3DContainer', {
      contextOptions: {
        contextType: 2, // WebGL2
      },
    });
  
    viewer.resolutionScale = window.devicePixelRatio;
    scene = viewer.scene;
  
    viewer.imageryLayers.addImageryProvider(new SuperMap3D.BingMapsImageryProvider({
      url: 'https://dev.virtualearth.net',
      mapStyle: SuperMap3D.BingMapsStyle.AERIAL,
      key: 'Your_Bing_Maps_Key', // Replace with your key
    }));
  
    viewshed3D = new SuperMap3D.ViewShed3D(scene);
    pointHandler = new SuperMap3D.DrawHandler(viewer, SuperMap3D.DrawMode.Point);
    handlerPolygon = new SuperMap3D.DrawHandler(viewer, SuperMap3D.DrawMode.Polygon, 0);
  
    pointHandler.drawEvt.addEventListener((result) => {
      const position = result.object.position;
      viewPosition = position;
      const cartographic = SuperMap3D.Cartographic.fromCartesian(position);
      const longitude = SuperMap3D.Math.toDegrees(cartographic.longitude);
      const latitude = SuperMap3D.Math.toDegrees(cartographic.latitude);
      const height = cartographic.height + 1.8;
  
      viewshed3D.viewPosition = [longitude, latitude, height];
      viewshed3D.build();
      scene.viewFlag = false;
    });
  
    handlerPolygon.drawEvt.addEventListener((result) => {
      const positions = result.object.positions.map((pos) => {
        const cartographic = SuperMap3D.Cartographic.fromCartesian(pos);
        return [
          SuperMap3D.Math.toDegrees(cartographic.longitude),
          SuperMap3D.Math.toDegrees(cartographic.latitude),
          cartographic.height,
        ];
      }).flat();
  
      viewshed3D.addClipRegion({ name: 'test', position: positions });
      handlerPolygon.deactivate();
    });
  
    const handler = new SuperMap3D.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction((e) => {
      if (!scene.viewFlag) {
        scene.pickPositionAsync(e.endPosition).then((last) => {
          const distanceVal = SuperMap3D.Cartesian3.distance(viewPosition, last);
          if (distanceVal > 0) {
            const cartographic = SuperMap3D.Cartographic.fromCartesian(last);
            const longitude = SuperMap3D.Math.toDegrees(cartographic.longitude);
            const latitude = SuperMap3D.Math.toDegrees(cartographic.latitude);
            const height = cartographic.height;
            viewshed3D.setDistDirByPoint([longitude, latitude, height]);
          }
        });
      }
    }, SuperMap3D.ScreenSpaceEventType.MOUSE_MOVE);
  
    handler.setInputAction(() => {
      scene.viewFlag = true;
      showSettings.value = true;
      direction.value = viewshed3D.direction;
      pitch.value = viewshed3D.pitch;
      distance.value = viewshed3D.distance;
      horizontalFov.value = viewshed3D.horizontalFov;
      verticalFov.value = viewshed3D.verticalFov;
    }, SuperMap3D.ScreenSpaceEventType.RIGHT_CLICK);
  });
  
  function startViewshed() {
    if (pointHandler.active) return;
    viewshed3D.distance = 0.1;
    scene.viewFlag = true;
    pointHandler.activate();
  }
  
  function drawClipRegion() {
    handlerPolygon.deactivate();
    handlerPolygon.activate();
  }
  
  function clearAnalysis() {
    viewshed3D.removeAllClipRegion();
    pointHandler.clear();
    showSettings.value = false;
    viewshed3D.distance = 0.1;
    scene.viewFlag = true;
  }
  
  function updateClipMode() {
    const SuperMap3D = window.SuperMap3D;
    const mode = clipMode.value === 'keep-inside'
      ? SuperMap3D.ClippingType.KeepInside
      : SuperMap3D.ClippingType.KeepOutside;
    viewshed3D.setClipMode(mode);
  }
  
  // Watchers for UI interaction
  watch(direction, (val) => {
    if (viewshed3D.direction !== val) {
      viewshed3D.direction = val;
      viewshed3D.removeClipRegion('test');
    }
  });
  watch(pitch, (val) => {
    if (viewshed3D.pitch !== val) {
      viewshed3D.pitch = val;
      viewshed3D.removeClipRegion('test');
    }
  });
  watch(distance, (val) => {
    if (viewshed3D.distance !== val) {
      viewshed3D.distance = val;
      viewshed3D.removeClipRegion('test');
    }
  });
  watch(horizontalFov, (val) => {
    if (viewshed3D.horizontalFov !== val) {
      viewshed3D.horizontalFov = val;
      viewshed3D.removeClipRegion('test');
    }
  });
  watch(verticalFov, (val) => {
    if (viewshed3D.verticalFov !== val) {
      viewshed3D.verticalFov = val;
      viewshed3D.removeClipRegion('test');
    }
  });
  watch(visibleAreaColor, (val) => {
    viewshed3D.visibleAreaColor = window.SuperMap3D.Color.fromCssColorString(val);
  });
  watch(invisibleAreaColor, (val) => {
    viewshed3D.hiddenAreaColor = window.SuperMap3D.Color.fromCssColorString(val);
  });
  </script>
  
  <style scoped>
  #mainContainer {
    position: relative;
    width: 100%;
    height: 100%;
  }
  #SuperMap3DContainer {
    width: 100%;
    height: 100%;
  }
  #toolbar {
    position: absolute;
  top: 800px;
  left: 10px;
  background-color: rgba(38, 38, 38, 0.85);
  padding: 12px 16px;
  border-radius: 6px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  width: auto;
}

#hideToolbarBtn {
  align-self: flex-end;
  background-color: #555;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 13px;
  cursor: pointer;
  margin-top: 6px;
}
#hideToolbarBtn:hover {
  background-color: #777;
}

#toolbar button {
  background-color: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

#toolbar button:hover {
  background-color: #444;
}

#toggleToolbarFloating {
  position: absolute;
  top: 100px;
  left: 10px;
  z-index: 800;
  background-color: #596969;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  width: 150px;
  cursor: pointer;
}

#toolbar .param-item {
  color: white;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
}

#toggleToolbar {
  background: transparent;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 0 6px;
  line-height: 1;
  z-index: 700;
}

.toolbar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  z-index: 00;
}

.toolbar-title {
  color: white;
  font-size: 14px;
  font-weight: bold;
}

#toolbar select {
  background-color: #222;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 13px;
}
  #wrapper {
    position: absolute;
    top: 70px;
    right: 20px;
    background-color: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    z-index: 1100;
    max-width: 300px;
  }
  #wrapper h1 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  #wrapper label {
    display: block;
    font-size: 12px;
    margin-top: 10px;
  }
  #wrapper input[type="range"],
  #wrapper input[type="number"],
  #wrapper input[type="color"] {
    width: 100%;
    margin-bottom: 5px;
  }
  .close {
    float: right;
    cursor: pointer;
    font-size: 18px;
  }
  </style>
  