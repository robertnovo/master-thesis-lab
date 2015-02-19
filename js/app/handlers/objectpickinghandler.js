define(function(require) {

    var Mediator = require('mediator');
    var Raycaster = require('tools/raycaster');
    var _ = require('underscore');

    var TrackingHandler = require('handlers/trackinghandler');

    var ObjectPickingHandler = (function() {

        var intersectObjects;

        function createIntersectObjects (allGeometryAsList) {
            intersectObjects = _.map(allGeometryAsList, function(value, key, list){
                var mesh = value.getMesh();
                var type = value.getType();
                mesh.type = type;
                return mesh;
            });
        }

        var geometryHandler;
        function ObjectPickingHandler (args) {
            geometryHandler = args;
            if (geometryHandler.getIsLoaded()) {
                createIntersectObjects(geometryHandler.getAllGeometry());
                this.bindEvents();
            } else {
                Mediator.subscribe("load:geometry", function(isLoaded) {
                    if (isLoaded) {
                        createIntersectObjects(geometryHandler.getAllGeometry());
                        this.bindEvents();
                    }
                }.bind(this), "ObjectPickingHandler");
            }
        }

        ObjectPickingHandler.prototype = {
            bindEvents: function() {
                window.addEventListener("click", function(event) {
                    event.preventDefault();
                    var intersects = Raycaster.castRay(event, intersectObjects);
                    // debugger
                    if (intersects.length > 0) {
                        switch(intersects[0].object.type) {
                            case "building":
                                // Mediator.publish("ray:objects", intersects, "ObjectPickingHandler");
                                // if (event.altKey) {
                                    Mediator.publish("select:building",
                                        {
                                            object: intersects[0].object,
                                            event: event
                                        }, "ObjectPickingHandler");
                                // }
                                break;
                            default:
                                break;
                        }
                    }
                }.bind(this), false);
            }

        };

        return ObjectPickingHandler;

    })();

    return ObjectPickingHandler;

});
