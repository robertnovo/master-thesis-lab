define( ["three", "environment/camera", "container"], function( THREE, camera, container ) {
  var controls = new THREE.OrbitControls( camera, container );

  controls.maxPolarAngle = Math.PI/2;
  controls.zoomSpeed = 0.5;
  controls.rotateSpeed = 1.5;
  // set default target to origo.
  controls.target.set(-100,0,20);
  return controls;
} );
