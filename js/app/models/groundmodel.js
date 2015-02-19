define(function(require) {
    var THREE = require('three');
    var Material = require('material');
    var BaseModel = require('models/basemodel');

    var x = 700,
        y = 700,
        scale = 0.8;
    //Constructor
    function GroundModel(options){
        BaseModel.call(this, null, "ground");
        var geometry = new THREE.PlaneGeometry( x*scale, y*scale);
        this.mesh = new THREE.Mesh( geometry, Material.ground );
        // console.log(this.mesh);
        // this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.position.set(50,105,20);
    }

    GroundModel.prototype = Object.create(BaseModel.prototype);
    GroundModel.prototype.constructor = GroundModel;

    return GroundModel;
});
