define(function(require) {

    var THREE = require('three');
    var TWEEN = require('tween');
    var Mediator = require('mediator');
    var _ = require('underscore');

    var CameraAnimationHandler = (function(){

        //Private variables
        var scene, controls, buildings, app;

        function findVectorCenter (from, to) {
            return new THREE.Vector3( (from.x+to.x)/2, (from.y+to.y)/2, (from.z+to.z)/2 );
        }

        function getVectorCenter (from, to) {
            return from.lerp(to, 0.5);
        }

        //Constructor
        function CameraAnimationHandler (Scene, Controls, App) {
            Mediator.subscribe("load:geometry", function(isLoaded) {
                if (isLoaded) {
                    buildings = app.geometryHandler.getBuildings();
                }
            }, "CameraAnimationHandler");
            app = App;
            scene = Scene;
            controls = Controls;
            Mediator.subscribe("select:building", this.getEvent.bind(this));

            // initTestingGeometry()

        }

        function initTestingGeometry () {
            var geometry = new THREE.SphereGeometry( 5, 32, 32 );
            var material = new THREE.MeshBasicMaterial( {color: 0xff00ff} );
            var sphere = new THREE.Mesh( geometry, material );
            scene.add(sphere);
            sphere.position.z = 50;
            var sphere2 = sphere.clone();
            sphere2.material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            sphere2.position.z = 60;
            scene.add(sphere2);
            var sphere3 = sphere.clone();
            sphere3.material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
            scene.add(sphere3);
        }

        function drawLine (from, to) {

            var subVector = new THREE.Vector3();
            subVector.subVectors(to, from);
            // console.log(subVector.lerp(0.5));

            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(from.x, from.y, from.z));
            geometry.vertices.push(new THREE.Vector3(to.x, to.y, to.z));
            var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x0000ff, linewidth: 3}));
            scene.add( line );
        }

        //Public functions
        CameraAnimationHandler.prototype = {
            prevPos: null,
            initialized: false,
            getEvent: function(args) {
                if(args.event.altKey) {
                    this.flyTo(args.object);
                }
                else if(args.event.shiftKey) {
                    this.showOverView(args.object);
                } else { // no modifier
                    this.showObjectInfo(args.object);
                }
            },
            setPrevPos: function(pos){
                this.prevPos = pos;
            },
            getPrevPos: function() {
                return this.prevPos;
            },
            flyTo: function(object) { // if alt + click

                this.setPrevPos(null);

                var prevPos = controls.target.clone();
                var building = buildings[object.id],
                    targetPos = building.mesh.centroid,
                    start = new THREE.Vector3(),
                    currentCameraPosition = controls.object.position;

                var targetTween = new TWEEN.Tween({ x: 0 })
                .to({x:1}, 2000)
                .easing( TWEEN.Easing.Exponential.InOut )
                // .easing( TWEEN.Easing.Bounce.InOut )
                .onUpdate(function() {
                    start.copy(prevPos);
                    start.lerp(targetPos, this.x);
                    controls.target.copy(start);
                })
                .start();

                var tween = new TWEEN.Tween( currentCameraPosition )
                .to({
                    x: targetPos.x-150,
                    y: targetPos.y-150,
                    z: 150
                }, 2000 )
                .easing( TWEEN.Easing.Exponential.InOut )
                .onUpdate(function () {
                    // console.log(this);
                })
                .start();
            },
            showOverView: function(object) { // if shift + click

                var building = buildings[object.id];
                var prevPos,
                    targetPos = building.mesh.centroid,
                    start = new THREE.Vector3(),
                    currentCameraTarget = controls.target.clone(),
                    currentCameraPosition = controls.object.position,
                    betweenBuildings;

                if (this.getPrevPos() != null) {
                    prevPos = this.getPrevPos();
                    betweenBuildings = new THREE.Vector3().copy(prevPos).lerp(targetPos, 0.5);
                } else {
                    prevPos = controls.target.clone();
                    targetPos = prevPos.clone().lerp(targetPos, 0.5);
                    betweenBuildings = targetPos.clone();
                }

                // set previousPos to current target
                this.setPrevPos(building.mesh.centroid);

                var targetTween = new TWEEN.Tween({x: 0})
                .to({x:1}, 2000)
                .easing( TWEEN.Easing.Exponential.InOut )
                .onUpdate(function() {
                    start.copy(currentCameraTarget);
                    start.lerp(betweenBuildings, this.x);
                    controls.target.copy(start);
                })
                .start();

                // var tween = new TWEEN.Tween( currentCameraPosition )
                // .to({
                //     x: betweenBuildings.x,
                //     y: betweenBuildings.y,
                //     z: 500
                // }, 2000 )
                // .easing( TWEEN.Easing.Exponential.InOut )
                // .onUpdate( function () {} )
                // .onComplete( function() {} )
                // .start();

                // sphere.position.x = targetPos.x;
                // sphere.position.y = targetPos.y;

                // sphere2.position.x = prevPos.x;
                // sphere2.position.y = prevPos.y;

                // sphere3.position.x = betweenBuildings.x;
                // sphere3.position.y = betweenBuildings.y;
                // sphere3.position.z = betweenBuildings.z;

                // sphere.position.set(center.x, center.y, center.z);
                // scene.add(sphere);
                // var center = getVectorCenter(currentCameraPosition, targetPos);
            },
            showObjectInfo: function(object) {
                var realEstates = buildings[object.id].metadata.RealEstates;
                // console.log(app.geometryHandler.getSelectedBuildings());

            }
        }

        return CameraAnimationHandler;

    })();

    return CameraAnimationHandler;
});

