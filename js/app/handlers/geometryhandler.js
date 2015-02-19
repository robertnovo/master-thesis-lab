define(function(require) {

    //Tools
    var JSONLoader = require('tools/loaders/jsonloader');
    var _ = require('underscore');
    var Async = require('async');
    var Mediator = require('mediator');
    var ModelFactory = require('models/modelfactory');

    var GeometryHandler = (function(){

        //Private variables
        var isLoaded = false;
        var scene, lights;
        var buildingList = {};
        var allGeometry = [];

        //Constructor
        function GeometryHandler (Scene, Lights) {

            Mediator.subscribe("load:geometry", function() {
                // console.log(app.geometryHandler.getBuildingFromId(1616).select(true));
                buildingList[1616].ignoreRayCaster = true;
                buildingList[1616].select(false, 0x5251ff);
                buildingList[1576].ignoreRaycaster = true;
                buildingList[1576].select(false, 0x64ff2f); // gaia
                buildingList[1607].ignoreRaycaster = true;
                buildingList[1607].select(false, 0x00aeff);
                buildingList[1604].ignoreRaycaster = true;
                buildingList[1604].select(false, 0xff8b13);
            });

            scene = Scene;
            lights = Lights;
            Mediator.subscribe("select:building", function(object) {
                if(object.event.button === 0 && false === object.event.altKey) { // left click
                    console.log(object.event);
                    buildingList[object.object.id].select(buildingList[object.object.id].isSelected);
                } else if (object.event.button === 1) { // middle click
                    buildingList[object.object.id].makeTransparent();
                }
            }, "GeometryHandler");
        }

        //Public functions
        GeometryHandler.prototype = {
            init: function() {
                if(isLoaded)
                    return;

                //Add lights
                scene.add(lights.dirLight);
                scene.add(lights.ambient);

                Async.parallel([
                    // building geometry
                    function(callback) {
                        JSONLoader.ReadBuildings('files/3DLarge.json', function(buildings) {
                            _.each(buildings, function(value, key, list){
                                buildingList[value.mesh.id] = value;
                                scene.add(value.getMesh());
                            });
                            allGeometry = allGeometry.concat(buildings);
                            callback(null, buildingList);
                        });
                    },
                    function(callback) {
                        var ground = ModelFactory.createObject({
                            type: "ground"
                        });
                        allGeometry.push(ground);
                        scene.add(ground.getMesh());
                        // TrackingHandler.addTrackingObject(ground.getMesh());
                        callback(null, ground);
                    }
                ], function(err, results) {
                    // geometry loaded;
                    isLoaded = true;
                    Mediator.publish("load:geometry", isLoaded, "GeometryHandler");
                    // console.log("async result: ", results);
                });
            },

            getIsLoaded: function(){
                return isLoaded;
            },

            getBuildingFromId: function(id) {
                return buildingList[id]
            },

            getBuildings: function() {
                return buildingList;
            },

            getSelectedBuildings: function() {
                return _.where(buildingList, { isSelected: true });
            },

            getAllGeometry: function() {
                return allGeometry;
            }

        };

        return GeometryHandler;

    })();

    return GeometryHandler;
});
