define( ["three", "scene"], function ( THREE, scene ) {
    var light = new THREE.DirectionalLight( 0xf6f6f6 );
    light.position.set( 500, 0, 1000 );
    light.shadowCameraNear  = 0.01;
    light.shadowCameraFar   = 2000;
    light.castShadow        = true;
    light.shadowDarkness        = 0.2;
    // light.shadowCameraVisible   = true;
    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;

    var ambientLight = new THREE.AmbientLight(0x404040); // soft white light

    // return light;
    return {
        dirLight: light,
        ambient: ambientLight
    }
} );
