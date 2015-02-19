define(function(require) {

    var THREE = require('three');
    var $ = require('jquery');
    var _ = require('underscore');
    var ModelFactory = require('models/modelfactory');

    // returns an array of building geometry
    function createBuildingsGeometry (modelArray) {
        var YLED = 6496800;
        var XLED = 131200;
        var scale = 30;
        var translate = 0;

        var buildingsGeometry = [];

        for (var i = 0; i < modelArray.length; i++) {

            var model = modelArray[i];

            var newGeometry = new THREE.Geometry();
            var debugGeometry = new THREE.Geometry();

            var group = new THREE.Object3D();

            var tmpGeometry = new THREE.Geometry();

            // sg = surface geometry
            for ( var sg = 0; sg < model.Surfaces.length; sg++ ) {
                var surface = model.Surfaces[sg];

                for ( var vs = 0; vs < model.Vertices.length; vs++ ) {
                    var vertex = model.Vertices[vs];
                    newGeometry.vertices.push(new THREE.Vector3( vertex[0] - XLED, vertex[1] - YLED, vertex[2] ));
                    debugGeometry.vertices.push(new THREE.Vector3( vertex[0] - XLED, vertex[1] - YLED, vertex[2] ));
                }

                for ( var sp = 0; sp < surface.length; sp++ ) {

                    var triIndex = surface[sp];
                    var triangle = model.Triangles[triIndex];

                    newGeometry.faces.push(new THREE.Face3(
                        triangle[0],
                        triangle[1],
                        triangle[2]
                    ));

                    debugGeometry.faces.push(new THREE.Face3(
                        triangle[0],
                        triangle[1],
                        triangle[2]
                    ));

                }

                var originalGeometry = newGeometry.clone();
                originalGeometry.computeFaceNormals();
                originalGeometry.computeBoundingSphere();

                var meshObject = new THREE.Mesh( originalGeometry );
                tmpGeometry.merge(meshObject.geometry, meshObject.matrix);

            } // end sg-loop

            buildingsGeometry.push(tmpGeometry);
        }

        return buildingsGeometry;
    }

    // calls on the factory create and returns an array of buildingObjects
    function createBuildings (buildingGeometryList, objects) {
        var buildings = [];

        _.each(_.zip(buildingGeometryList, objects), function(value, key, list){
            buildings.push(
                ModelFactory.createObject({
                    type: "building",
                    geometry: value[0],
                    metadata: value[1].Metadata
                })
            );

        });

        // _.each(buildingGeometryList, function(value, key, list){
        //     // console.log(value);
        //     buildings.push(
        //         ModelFactory.createObject({
        //             type: "building",
        //             geometry: value,
        //             metadata: "some nice metadata here"
        //         })
        //     );

        // });

        return buildings;
    }

    return {
        ReadBuildings: function(fileName, callback) {
            $.getJSON(fileName, function(json, textStatus) {
                var tmpMeshObjects = [];
                var meshIndex = 0;
                for ( var modelKey in json.ModelData ) {
                    var model = json.ModelData[modelKey];

                    // checker
                    if ( model.Surfaces != null && model.Triangles != null && model.Vertices != null && model.Metadata != null) {
                        tmpMeshObjects[meshIndex++] = model;
                    }
                }
                //

                // console.log(tmpMeshObjects[0].Metadata);
                var buildingsGeometry = createBuildingsGeometry(tmpMeshObjects);

                // create the buildings with metadata
                buildings = createBuildings(buildingsGeometry, tmpMeshObjects);

                // callback function adds buildings to the scene
                if (callback) {
                    callback(buildings);
                }

            });
        }
    };
});
