define(function(require) {
    var THREE = require('three');
    var Material = require('material');
    var Mediator = require('mediator');
    var BaseModel = require('models/basemodel');
    var TrackingHandler = require('handlers/trackinghandler');

    //Constructor
    function BuildingModel(options){
        BaseModel.call(this, null, "building");
        this.mesh = new THREE.Mesh( options.geometry, Material.building.clone() );
        this.mesh.centroid = this.calculateCentroid(this.mesh);
        this.ignoreRayCaster = false;
        // this.mesh.material.opacity = 0.1;
        this.mesh.castShadow = true;
        this.metadata = options.metadata;
    }

    BuildingModel.prototype = Object.create(BaseModel.prototype);
    BuildingModel.prototype.constructor = BuildingModel;
    BuildingModel.prototype.isSelected = false;
    BuildingModel.prototype.select = function(selected, color) {
        this.isSelected = !selected;
        this.color = color || 0xff0000;
        // console.log(this.isSelected);
        if (this.isSelected) {
            this.mesh.material = new THREE.MeshLambertMaterial( { color: this.color } );
            TrackingHandler.addTrackingObject(this);
        } else {
            this.mesh.material = Material.building;
            TrackingHandler.removeTrackingObject(this);
        }
    };

    BuildingModel.prototype.ignoreRayCaster = function() {
        this.ignoreRayCaster = true;
    }

    BuildingModel.prototype.makeTransparent = function() {
        this.mesh.material = Material.transparentBuilding;
        this.mesh.material.transparent = true;
        this.mesh.material.opacity = 0.3;
    }
    return BuildingModel;
});
