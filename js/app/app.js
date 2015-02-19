define(function(require) {

  // 3rd party libs
  var TWEEN = require('tween');
  var THREE = require('three');
  var Controls = require('controls');
  var Geometry = require('geometry');
  var Material = require('material');
  var Renderer = require('renderer');
  var Scene = require('scene');
  var Mediator = require('mediator');

  // Tools
  var JsonLoader = require('tools/loaders/jsonloader');
  var Raycaster = require('tools/raycaster');

  // Environment
  var Camera = require('environment/camera');
  var Lights = require('environment/Light');

  // Handlers
  var GeometryHandler = require('handlers/geometryhandler');
  var CameraAnimationHandler = require('handlers/cameraanimationhandler');
  var ObjectPickingHandler = require('handlers/objectpickinghandler');
  var TrackingHandler = require('handlers/trackinghandler');

  var app = {
    helpers: {},
    geometryHandler: {},
    cameraAnimationHandler: {},
    objectPickingHandler: {},
    trackingHandler: {},
    init: function () {
      app.geometryHandler = new GeometryHandler(Scene, Lights);
      app.geometryHandler.init();

      app.objectPickingHandler = new ObjectPickingHandler(app.geometryHandler);
      app.cameraAnimationHandler = new CameraAnimationHandler(Scene, Controls, this);

      TrackingHandler.init(app.cameraAnimationHandler);

      app.helpers.axis = new THREE.AxisHelper( 100 );
      Scene.add(app.helpers.axis);
      // Scene.add(new THREE.CameraHelper( Camera ));
      this.animate();
    },
    update: function() {
      TWEEN.update();
      TrackingHandler.update();
      Raycaster.createTransparentPath(app.geometryHandler.getSelectedBuildings(), app.geometryHandler.getBuildings());
      if (Controls.enabled) {
        Controls.update(); // update orbitcontrols
      }
    },
    animate: function () {
      window.requestAnimationFrame( app.animate );
      Renderer.render( Scene, Camera );
      app.update();
    }
  };
  return app;
});
