/* global require */
require.config({
  // urlArgs: "bust=" + (new Date()).getTime(), // development
  // Default load path for js files
  baseUrl: 'js/app',
  shim: {
    // --- Use shim to mix together all THREE.js subcomponents
    'threeCore': { exports: 'THREE' },
    // 'TrackballControls': { deps: ['threeCore'], exports: 'THREE' },
    'OrbitControls': { deps: ['threeCore'], exports: 'THREE' },
    // --- end THREE sub-components
    'detector': { exports: 'Detector' },
    'stats': { exports: 'Stats' },
    'tween': { exports: 'TWEEN'},
    deps: ['jquery']
  },
  // Third party code lives in js/lib
  paths: {
    // --- start THREE sub-components
    three: '../lib/three',
    threeCore: '../lib/three.min',
    // TrackballControls: '../lib/controls/TrackballControls',
    OrbitControls: '../lib/controls/OrbitControls',
    // --- end THREE sub-components
    detector: '../lib/Detector',
    stats: '../lib/stats.min',
    // Require.js plugins
    text: '../lib/text',
    shader: '../lib/shader',
    // Where to look for shader files
    shaders: '../shaders',

    // third party libs
    jquery: '../lib/jquery.min',
    tween: '../lib/tween.min',
    underscore: '../lib/underscore.min',
    async: '../lib/async',
  }
});

// Start the app
require( ['detector', 'app', 'container'], function ( Detector, app, container ) {
  if ( ! Detector.webgl ) {
    Detector.addGetWebGLMessage();
    container.innerHTML = "";
  }

  // Initialize our app and start the animation loop (animate is expected to call itself)
  app.init();
} );
