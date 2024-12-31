# 洪水地图PoC

# !important 该Readme由豆包AI生成，仅参考，注意其中可能包含错误。

这个项目是一个洪水地图的概念验证（Proof of Concept），使用Vite作为构建工具，Vue3作为前端框架，JavaScript作为开发语言。

## 项目概述
本项目旨在展示一个功能丰富的洪水地图应用，通过获取洪水数据，并将其在地图或场景中进行可视化呈现，为用户提供多维度的洪水信息查看和分析功能。

## 功能
- **功能1：时间选择与水位叠加**：
    - 在场景中叠加一个静态图层，同时配备一个可选择时间的控件。用户可以选择特定的时间（例如2024年6月），点击确认后，根据所选时间对应的水位高度，在场景里叠加相应高度的水面，让用户直观地看到不同时间点的水位情况。
- **功能2：视频参考效果重现**：
    - 实现与晓钰发出来的视频相同的效果，为用户提供特定的洪水场景展示体验。
- **功能3：摄像头信息展示**：
    - 在场景中放置一些摄像头模型（或用点表示），用户点击这些点时，会弹出一个窗口，展示该摄像头拍摄的照片信息，方便用户查看相关区域的图像信息。
- **功能4：视频叠加展示**：
    - 主要展示视频叠加功能，用户可以查看叠加的洪水视频，目前暂时不需要视频对准地形或影像，后续会有孙总提供洪水视频资源。
- **功能5：水位信息展示**：
    - 与功能3类似，用户点击场景中的元素后，将展示该位置的水位信息，为用户提供更精确的水位数据查看服务。
- **功能6：热力图叠加**：
    - 根据水位信息，将其转换为热力图并叠加到场景中，使用户能够通过热力图的形式直观感受水位的分布情况。


## 技术栈
- **Vite**：新一代前端构建工具，提供快速的开发服务器和高效的构建能力。
- **Vue3**：渐进式JavaScript框架，用于构建用户界面，利用其组件化、响应式数据等特性。
- **JavaScript**：主要开发语言，用于实现业务逻辑和数据处理。


## 项目结构（示例）
```
|-- src
|   |-- components
|   |   |-- MapComponent.vue  // 地图显示组件
|   |   |-- TimeSelectComponent.vue  // 时间选择组件
|   |   |-- CameraMarkerComponent.vue  // 摄像头标记组件
|   |   |-- VideoOverlayComponent.vue  // 视频叠加组件
|   |   |-- WaterLevelInfoComponent.vue  // 水位信息组件
|   |   |-- HeatMapComponent.vue  // 热力图组件
|   |-- assets
|   |   |-- styles.css  // 样式文件
|   |-- services
|   |   |-- FloodDataService.js  // 洪水数据获取服务
|   |-- composables
|   |   |-- useTimeSelect.js  // 时间选择的组合式函数
|   |   |-- useCameraMarker.js  // 摄像头标记的组合式函数
|   |   |-- useVideoOverlay.js  // 视频叠加的组合式函数
|   |   |-- useWaterLevelInfo.js  // 水位信息的组合式函数
|   |   |-- useHeatMap.js  // 热力图的组合式函数
|   |-- App.vue  // 主应用组件
|   |-- main.js  // 应用入口文件
|-- public
|   |-- index.html  // 页面模板
|-- vite.config.js  // Vite配置文件
```


## 安装和运行
1. 克隆本仓库：
```bash
git clone [你的仓库地址]
```
2. 进入项目目录：
```bash
cd flood-map-poc
```
3. 安装依赖：
```bash
npm install -g pnpm
pnpm install
```
4. 运行开发服务器：
```bash
pnpm run dev
```


## 配置
- **Vite 配置**：`vite.config.js`文件包含了Vite的配置信息，可根据需要进行调整，如添加新的插件、修改服务器端口等。
- **地图库配置**：在`MapComponent.vue`中，根据使用的地图库进行配置，包括API密钥、初始地图视图等。
- **洪水数据配置**：在`FloodDataService.js`中，根据数据来源进行相应的配置，如设置 API 的 URL 或文件路径。


<!-- ## 贡献
如果你想为这个项目做出贡献，可以通过以下方式：
1. 提出新的功能建议或报告问题：在GitHub仓库的`Issues`页面提交新的Issue。
2. 提交代码：
    - Fork 这个仓库。
    - 创建一个新的分支（`git checkout -b feature/your-feature-name`）。
    - 提交你的代码（`git commit -am 'Add some feature'`）。
    - 推送分支到你的Fork（`git push origin feature/your-feature-name`）。
    - 创建一个 new Pull Request，详细描述你的更改。 -->


<!-- ## 许可证
本项目采用[具体许可证名称，如MIT]许可证。 -->


## 开发注意事项
- 在开发过程中，请充分利用 Vue3 的组合式 API 进行逻辑组织，将复杂的逻辑从 Vue 组件中分离到 `composables` 目录下的 `.js` 文件中，提高代码的可维护性和可测试性。
- 对于数据处理，确保数据的有效性和错误处理，避免因数据问题导致的应用崩溃。
<!-- - 测试是一个重要的部分，虽然本项目可能暂时没有包含完整的测试套件，但在扩展或完善项目时，建议添加单元测试和集成测试，可使用 Jest 等测试框架。 -->


## 致谢
感谢使用本项目，希望这个洪水地图PoC能为你的开发提供帮助，如果有任何问题或建议，请随时联系我们。


## 开发思路

### 功能1：时间选择与水位叠加
1. **时间选择组件**：
    - 在 `src/components/TimeSelectComponent.vue` 中，使用组合式 API 从 `src/composables/useTimeSelect.js` 中导入相关逻辑。
    - 调用 `useTimeSelect` 函数，该函数将包含处理时间选择的逻辑，如创建响应式的时间变量、处理时间选择的事件等。
    - 将选择的时间信息传递给 `FloodDataService.js`，用于获取相应时间的水位数据。
2. **水位叠加**：
    - 在 `MapComponent.vue` 或一个新的 `WaterLayerComponent.vue` 中，根据获取的水位数据，使，将水位平面或曲面叠加到场景中。


### 功能2：视频参考效果重现
- 仔细研究晓钰提供的视频，将其效果拆解为具体的功能和视觉元素。
- 根据拆解的功能，在相应的组件中（如 `MapComponent.vue` 或其他相关组件）添加所需的元素和交互逻辑，可使用组合式 API 组织内部逻辑。


### 功能3：摄像头信息展示
1. **摄像头标记组件**：
    - 在 `src/components/CameraMarkerComponent.vue` 中，使用组合式 API 从 `src/composables/useCameraMarker.js` 中导入 `useCameraMarker` 函数。
    - `useCameraMarker` 函数将处理摄像头标记的创建、点击事件的处理，以及调用 `FloodDataService.js` 获取照片数据等逻辑。
    - 点击时弹出的 `div` 可使用 `vue-modal` 或自定义 `div` 样式实现，显示该摄像头拍摄的照片信息。


### 功能4：视频叠加展示
1. **视频叠加组件**：
    - 在 `src/components/VideoOverlayComponent.vue` 中，使用组合式 API 从 `src/composables/useVideoOverlay.js` 中导入 `useVideoOverlay` 函数。
    - 等待孙总提供洪水视频资源，叠加地图到场景中。


### 功能5：水位信息展示
1. **水位信息组件**：
    - 在 `src/components/WaterLevelInfoComponent.vue` 中，使用组合式 API 从 `src/composables/useWaterLevelInfo.js` 中导入 `useWaterLevelInfo` 函数。
    - `useWaterLevelInfo` 函数将处理点击事件，调用 `FloodDataService.js` 获取水位信息，并将其显示在弹出的 `div` 中。


### 功能6：热力图叠加
1. **热力图组件**：
    - 在 `src/components/HeatMapComponent.vue` 中，使用组合式 API 从 `src/composables/useHeatMap.js` 中导入 `useHeatMap` 函数。
    - 利用 `heatmap.js` 或其他热力图库，根据从 `FloodDataService.js` 获取的水位信息，生成热力图并叠加到场景中。


以下是部分代码示例：

### 时间选择组件示例（使用组合式 API）
```html
<!-- src/components/TimeSelectComponent.vue -->
<template>
  <div>
    <vue-datepicker v-model="selectedDate" @change="handleDateChange" />
  </div>
</template>

<script>
import VueDatepicker from 'vue-datepicker';
import 'vue-datepicker/index.css';
import { useTimeSelect } from '../composables/useTimeSelect.js';

export default {
  name: 'TimeSelectComponent',
  components: {
    VueDatepicker,
  },
  setup() {
    const { selectedDate, handleDateChange } = useTimeSelect();
    return {
      selectedDate,
      handleDateChange,
    };
  },
};
</script>
```

```javascript
// src/composables/useTimeSelect.js
import { ref } from 'vue';

export function useTimeSelect() {
  const selectedDate = ref(null);

  const handleDateChange = (date) => {
    // 发送事件或调用服务，将选择的日期传递给其他组件或服务
    console.log('Selected date:', date);
  };

  return {
    selectedDate,
    handleDateChange,
  };
}
```

### 代码解释

1. **组件部分（TimeSelectComponent.vue）**：
    - `import VueDatepicker from 'vue-datepicker'; import 'vue-datepicker/index.css'; import { useTimeSelect } from '../composables/useTimeSelect.js';`：导入 `vue-datepicker` 组件及其样式，以及组合式函数 `useTimeSelect`。
    - `const { selectedDate, handleDateChange } = useTimeSelect();`：调用 `useTimeSelect` 函数，获取其中的响应式数据 `selectedDate` 和函数 `handleDateChange`。
    - `return { selectedDate, handleDateChange };`：将获取的数据和函数返回给组件模板使用。


2. **组合式函数部分（useTimeSelect.js）**：
    - `import { ref } from 'vue';`：导入 Vue 的 `ref` 函数。
    - `export function useTimeSelect() {...}`：定义一个函数，在函数中使用 `ref` 创建响应式数据 `selectedDate` 和处理函数 `handleDateChange`，并将它们作为对象返回。


### 摄像头标记组件示例（使用组合式 API）
```html
<!-- src/components/CameraMarkerComponent.vue -->
<template>
  <div @click="showPhotoPopup">
    <img src="camera-icon.png" alt="Camera Marker" />
    <div v-if="showPopup" class="photo-popup">
      <img :src="photoUrl" alt="Camera Photo" />
    </div>
  </div>
</template>

<script>
import { useCameraMarker } from '../composables/useCameraMarker.js';

export default {
  name: 'CameraMarkerComponent',
  setup() {
    const { showPopup, photoUrl, showPhotoPopup } = useCameraMarker();
    return {
      showPopup,
      photoUrl,
      showPhotoPopup,
    };
  },
};
</script>

<style scoped>
.photo-popup {
  position: absolute;
  background-color: white;
  padding: 10px;
  border: 1px solid black;
  z-index: 100;
}
</style>
```

```javascript
// src/composables/useCameraMarker.js
import { ref } from 'vue';
import { FloodDataService } from '../services/FloodDataService.js';

export function useCameraMarker() {
  const showPopup = ref(false);
  const photoUrl = ref('');

  const showPhotoPopup = async () => {
    showPopup.value = true;
    // 调用服务获取照片数据
    photoUrl.value = await FloodDataService.getPhotoByMarker();
  };

  return {
    showPopup,
    photoUrl,
    showPhotoPopup,
  };
}
```

### 代码解释

1. **组件部分（CameraMarkerComponent.vue）**：
    - `import { useCameraMarker } from '../composables/useCameraMarker.js';`：导入组合式函数 `useCameraMarker`。
    - `const { showPopup, photoUrl, showPhotoPopup } = useCameraMarker();`：调用 `useCameraMarker` 函数，获取其中的响应式数据和函数。
    - `return { showPopup, photoUrl, showPhotoPopup };`：将获取的数据和函数返回给组件模板使用。


2. **组合式函数部分（useCameraMarker.js）**：
    - `import { ref } from 'vue'; import { FloodDataService } from '../services/FloodDataService.js';`：导入所需的依赖。
    - `const showPopup = ref(false); const photoUrl = ref('');`：创建响应式变量 `showPopup` 和 `photoUrl`。
    - `const showPhotoPopup = async () => {...}`：点击事件处理函数，将 `showPopup` 置为 `true`，并调用 `FloodDataService` 获取照片数据。


### 热力图组件示例（使用组合式 API 和 heatmap.js）
```html
<!-- src/components/HeatMapComponent.vue -->
<template>
  <div id="heatmap-container" style="height: 100vh;"></div>
</template>

<script>
import { onMounted } from 'vue';
import h337 from 'heatmap.js';
import { useHeatMap } from '../composables/useHeatMap.js';

export default {
  name: 'HeatMapComponent',
  setup() {
    const { initializeHeatMap } = useHeatMap();
    onMounted(initializeHeatMap);
    return {};
  },
};
</script>
```

```javascript
// src/composables/useHeatMap.js
import { onMounted } from 'vue';
import h337 from 'heatmap.js';
import { FloodDataService } from '../services/FloodDataService.js';

export function useHeatMap() {
  const initializeHeatMap = async () => {
    const heatmapContainer = document.getElementById('heatmap-container');
    const heatmapInstance = h337.create({
      container: heatmapContainer,
      radius: 10,
      maxOpacity: 0.5,
      minOpacity: 0,
      blur: 0.75,
    });
    
    // 获取水位数据
    const waterLevelData = await FloodDataService.getWaterLevelData();
    
    // 将水位数据转换为热力图数据格式
    const heatmapData = waterLevelData.map(item => ({
      x: item.x,
      y: item.y,
      value: item.waterLevel,
    }));
    
    heatmapInstance.setData({
      max: 100,
      data: heatmapData,
    });
  };

  return {
    initializeHeatMap,
  };
}
```

### 代码解释

1. **组件部分（HeatMapComponent.vue）**：
    - `import { onMounted } from 'vue'; import h337 from 'heatmap.js'; import { useHeatMap } from '../composables/useHeatMap.js';`：导入所需依赖。
    - `const { initializeHeatMap } = useHeatMap();`：调用 `useHeatMap` 函数，获取 `initializeHeatMap` 函数。
    - `onMounted(initializeHeatMap);`：在组件挂载时调用 `initializeHeatMap` 函数。


2. **组合式函数部分（useHeatMap.js）**：
    - `import { onMounted } from 'vue'; import h337 from 'heatmap.js'; import { FloodDataService } from '../services/FloodDataService.js';`：导入所需依赖。
    - `const initializeHeatMap = async () => {...}`：定义一个异步函数，用于初始化热力图，包括创建热力图实例、获取水位数据、转换数据格式和设置热力图数据。
    - `return { initializeHeatMap };`：将 `initializeHeatMap` 函数返回。


请注意，上述代码只是示例，在实际开发中，你需要根据具体情况进行调整和完善。你可能需要更复杂的逻辑和更多的交互处理，同时要确保不同组件之间的数据传递和服务调用的正确性。


你可以根据自己的实际需求，对这个 README 进行修改和完善，添加更多项目细节，使它更符合你的项目特色。

请确保在使用此 README 时，你已经正确配置了项目中的相关文件，如 `vite.config.js` 中的 Vite 配置、`MapComponent.vue` 中的地图库配置以及 `FloodDataService.js` 中的数据服务配置，以确保项目可以正常运行。


这样修改后的 README 更加强调了使用组合式 API 的开发方式，将不同组件的逻辑通过组合式函数存储在 `composables` 目录下，使代码结构更清晰，易于维护和扩展。你可以根据实际情况对组合式函数进行进一步的细化和优化，以满足具体的业务需求。

以下是对使用组合式 API 开发的一些优点和注意事项的补充说明：

### 组合式 API 的优点

- **逻辑复用性增强**：
    - 组合式函数可以轻松地在多个组件中复用，提高了代码的复用性。例如，如果你在多个组件中需要进行时间选择的逻辑，使用 `useTimeSelect` 函数可以避免重复编写代码。

- **代码组织清晰**：
    - 将逻辑从 Vue 组件中分离，使组件的模板、样式和逻辑更加清晰，更容易理解和维护。每个组合式函数都可以专注于一个特定的功能，避免了在 Vue 组件中混合多种逻辑。


### 注意事项

- **响应式数据的使用**：
    - 当使用 `ref` 和 `reactive` 创建响应式数据时，确保在组件中正确使用 `.value` 来访问和修改响应式数据的值，避免出现数据更新不及时的问题。

- **组合式函数的参数传递**：
    - 当组合式函数需要接收外部参数时，要注意参数的传递方式，确保在组件的 `setup` 函数中正确传递参数给组合式函数。


使用组合式 API 可以为项目带来更好的可维护性和可扩展性，希望上述示例和说明对你的开发有所帮助。如果在开发过程中遇到任何问题，可以查阅 Vue3 的官方文档或在社区中寻求帮助。