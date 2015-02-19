define( ["three", "container"], function ( THREE, container ) {
  var camera = new THREE.PerspectiveCamera( 45, 1, 1, 10000 );
  camera.position.x = -150;
  camera.position.y = -300;
  camera.position.z = 400;
  camera.up.set(0,0,1);
  // camera.showCameraHelper = false;
  var updateSize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };
  window.addEventListener( 'resize', updateSize, false );
  updateSize();

  return camera;
} );
