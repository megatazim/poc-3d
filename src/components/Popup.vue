<!-- <template>
  <div id="Container" class="viewer-container"></div>
  <div id="bubble" class="bubble" style="bottom:0;left:82%;display:none;">
    <div id="tools" style="text-align:right">
      <span style="color: rgb(95, 74, 121);padding: 5px;position: absolute;left: 10px;top: 4px;">\u5bf9\u8c61\u5c5e\u6027</span>
      <span class="fui-export" id="bubblePosition" style="color: darkgrey; padding:5px" title="\u505c\u9760"></span>
      <span class="fui-cross" title="\u5173\u95ed" id="close" style="color: darkgrey;padding:5px"></span>
    </div>
    <div style="overflow-y:scroll;height:150px" id="tableContainer">
      <table id="tab"></table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import $ from 'jquery';

let scenePosition = null;
let table = null;

onMounted(() => {
  const viewer = new SuperMap3D.Viewer("Container", {
    contextOptions: {
      contextType: 2
    }
  });

  viewer.scenePromise.then((scene) => {
    initPopup(viewer, scene);

    const dataServiceUrl = '//www.supermapol.com/realspace/services/data-dynamicDTH-2/rest/data/featureResults.rjson?returnContent=true';
    const dataSourceName = '铁岭矢量面';
    const dataSetName = 'New_Region3D_1';

    const promise = scene.addS3MTilesLayerByScp('//www.supermapol.com/realspace/services/3D-dynamicDTH-2/rest/realspace/datas/Config%20-%201/config', {
      name: 'oblique photography'
    });

    SuperMap3D.when(promise, () => {
      scene.camera.setView({
        destination: new SuperMap3D.Cartesian3(-2627223.829626321, 3932851.0803870987, 4265288.945477366),
        orientation: {
          heading: 4.396130342435847,
          pitch: -0.43133441484661317,
          roll: 0.000007429907218359233
        }
      });

      const handler = new SuperMap3D.ScreenSpaceEventHandler(scene.canvas);
      handler.setInputAction((e) => {
        viewer.entities.removeById('identify-area');
        scene.pickPositionAsync(e.position).then((position) => {
          scenePosition = position;
          const cartographic = SuperMap3D.Cartographic.fromCartesian(position);
          const queryPoint = {
            x: SuperMap3D.Math.toDegrees(cartographic.longitude),
            y: SuperMap3D.Math.toDegrees(cartographic.latitude)
          };
          queryByPoint(queryPoint);
        });
      }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
    });

    function queryByPoint(queryPoint) {
      const queryObj = {
        getFeatureMode: "SPATIAL",
        spatialQueryMode: "INTERSECT",
        datasetNames: [dataSourceName + ":" + dataSetName],
        geometry: {
          id: 0,
          parts: [1],
          points: [queryPoint],
          type: "POINT"
        }
      };

      $.post(dataServiceUrl, JSON.stringify(queryObj), (result) => {
        const resultObj = JSON.parse(result);
        if (resultObj.featureCount > 0) {
          addClapFeature(resultObj.features[0]);
        }
      });
    }

    function addClapFeature(feature) {
      for (let i = table.rows.length - 1; i > -1; i--) {
        table.deleteRow(i);
      }

      feature.fieldNames.forEach((name, i) => {
        const newRow = table.insertRow();
        newRow.insertCell().innerHTML = name;
        newRow.insertCell().innerHTML = feature.fieldValues[i];
      });

      $("#bubble").show();

      const lonLatArr = feature.geometry.points.flatMap(p => [p.x, p.y]);
      viewer.entities.add({
        id: 'identify-area',
        name: '单体化标识面',
        polygon: {
          hierarchy: SuperMap3D.Cartesian3.fromDegreesArray(lonLatArr),
          material: new SuperMap3D.Color(1.0, 0.0, 0.0, 0.3),
          classificationType: SuperMap3D.ClassificationType.S3M_TILE
        }
      });
    }

    function initPopup(viewer, scene) {
      let dock = false;
      const bubble = document.getElementById("bubble");
      table = document.getElementById("tab");

      $("#bubblePosition").click(() => {
        dock = !dock;
        if (bubble.classList.contains("bubble")) {
          bubble.classList.remove("bubble");
          bubble.classList.add("float");
          bubble.style.left = '82%';
          bubble.style.bottom = '45%';
          document.getElementById("tableContainer").style.height = "350px";
        } else {
          bubble.classList.remove("float");
          bubble.classList.add("bubble");
          document.getElementById("tableContainer").style.height = "150px";
        }
      });

      $("#close").click(() => {
        $("#bubble").hide();
      });

      scene.postRender.addEventListener(() => {
        if (scenePosition && !dock) {
          const windowPosition = SuperMap3D.SceneTransforms.wgs84ToWindowCoordinates(scene, scenePosition);
          bubble.style.bottom = (scene.canvas.height - windowPosition.y + 45) + 'px';
          bubble.style.left = (windowPosition.x - 70) + 'px';
          bubble.style.visibility = "visible";
        }
      });
    }
  });
});
</script>

<style scoped>
.viewer-container {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  overflow: hidden;
}
.bubble, .float {
  position: absolute;
  z-index: 1001;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  color: black;
}
</style> -->
