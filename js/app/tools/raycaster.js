define(function (require) {
    var Camera = require('environment/camera');
    var Material = require('material');
    var raycaster;

    var originalMaterials = [];

    return {
        castRay: function (event, intersectObjects) {
            if (!intersectObjects || intersectObjects.length === 0) {
                return;
            } else {
                var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
                vector.unproject(Camera);
                raycaster = new THREE.Raycaster(Camera.position, vector.sub(Camera.position).normalize());
                return raycaster.intersectObjects(intersectObjects);
            }
        },
        createTransparentPath: function (selectedBuildings, buildings) {
            _.each(buildings, function (building, key, list) {
                // building.mesh.material.wireframe = false;
                building.mesh.material.opacity = 1;
                building.mesh.material.transparent = false;
            });

            intersectObjects = _.map(buildings, function (value, key, list) {
                var mesh = value.getMesh();
                var type = value.getType();
                mesh.type = type;
                return mesh;
            });

            _.each(selectedBuildings, function (building, key, list) {
                var targetPos = new THREE.Vector3(building.mesh.centroid.x, building.mesh.centroid.y, building.mesh.centroid.z);
                raycaster = new THREE.Raycaster(Camera.position, targetPos.sub(Camera.position).normalize());
                var intersectedObjects = raycaster.intersectObjects(intersectObjects);
                if (intersectedObjects.length > 0) {
                    _.each(intersectedObjects, function (intersect, key, list) {

                        if (building.mesh.id !== intersect.object.id) {
                            // debugger
                            // intersect.object.material.wireframe = true;
                            intersect.object.material.transparent = true;
                            intersect.object.material.opacity = 0.2;
                        }

                    });
                }

            });
        }
    }
});
