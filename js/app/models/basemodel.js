define(function(require) {

    function BaseModel(mesh, type) {
        this.mesh = mesh;
        this.type = type;
    }

    BaseModel.prototype = {

        getMesh: function() {
            return this.mesh;
        },

        getType: function() {
            return this.type;
        },

        calculateCentroid: function(mesh) {
            var geometry = mesh.geometry;
            var position = mesh.position;

            geometry.computeBoundingBox();
            boundingBox = geometry.boundingBox;

            var x0 = boundingBox.min.x;
            var x1 = boundingBox.max.x;
            var y0 = boundingBox.min.y;
            var y1 = boundingBox.max.y;
            var z0 = boundingBox.min.z;
            var z1 = boundingBox.max.z;

            var bWidth = ( x0 > x1 ) ? x0 - x1 : x1 - x0;
            var bHeight = ( y0 > y1 ) ? y0 - y1 : y1 - y0;
            var bDepth = ( z0 > z1 ) ? z0 - z1 : z1 - z0;

            var centroidX = x0 + ( bWidth / 2 ) + position.x;
            var centroidY = y0 + ( bHeight / 2 )+ position.y;
            var centroidZ = z0 + ( bDepth / 2 ) + position.z;

            return geometry.centroid = { x : centroidX, y : centroidY, z : centroidZ };
        }
    }

    return BaseModel;
});
