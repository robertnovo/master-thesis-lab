define( ["three", "container"], function ( THREE, container ) {
  // container.innerHTML = "";
  var renderer = new THREE.WebGLRenderer({ antialias: true } );
  renderer.sortObjects = false;
  renderer.shadowMapEnabled = true;
  renderer.setClearColor(0xffffff);
  renderer.autoClear = true;
  console.log(container);
  container.appendChild( renderer.domElement );

  var updateSize = function () {
    renderer.setSize( window.innerWidth, window.innerHeight );
  };
  window.addEventListener( 'resize', updateSize, false );
  updateSize();

  return renderer;
} );
