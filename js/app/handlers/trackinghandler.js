define(function(require) {

    var Camera = require('environment/camera');
    var Renderer = require('renderer');
    require('underscore');

    var _cameraAnimationHandler;


    var _WIDTH = Renderer.domElement.width;
    var _HEIGHT = Renderer.domElement.height;
    var $trackingOverlay = $('.tracking-overlay');

    var _buildingObjects = null;
    var _frustum = new THREE.Frustum();
    var _trackers = [];

    function checkInsideFrustum (object) {
        var pos = new THREE.Vector3( object.centroid.x, object.centroid.y, object.centroid.z );
        var _projectionScreenMatrix = new THREE.Matrix4();
        _projectionScreenMatrix.multiplyMatrices( Camera.projectionMatrix, Camera.matrixWorldInverse );
        _frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( Camera.projectionMatrix, Camera.matrixWorldInverse ) );
        return _frustum.containsPoint( pos );
    }

    function trackPosition (object) {
        var p, v, percX, percY, left, top, vec;
        var trackerOverlay = _trackers[object.id];

        if(!trackerOverlay) {
            return;
        }

        vec = new THREE.Vector3();
        // p = new THREE.Vector3();
        p = new THREE.Vector3( object.centroid.x, object.centroid.y, object.centroid.z );
        // p.setFromMatrixPosition( object.matrixWorld );
        v = p.project(Camera);

        // translate our vector so that percX=0 represents
        // the left edge, percX=1 is the right edge,
        // percY=0 is the top edge, and percY=1 is the bottom edge.
        percX = (v.x + 1) / 2;
        percY = (-v.y + 1) / 2;

        // scale these values to our viewport size
        left = percX * _WIDTH;
        top = percY * _HEIGHT;
        var padding = 40;
        if (checkInsideFrustum( object )) {
            trackerOverlay.hide();
        } else {

            if ( left < 0 ) {
                left = padding;
            } else if ( left > _WIDTH ) {
                left = _WIDTH - padding;
            }

            if ( top < 0 ) {
                top = padding;
            } else if ( top > _HEIGHT ) {
                top = _HEIGHT - padding;
            }

            // position the overlay so that it's center is on top of
            // the sphere we're tracking
            trackerOverlay.show();
            trackerOverlay
                .css('left', (left - trackerOverlay.width() / 2) + 'px')
                .css('top', (top - trackerOverlay.height() / 2) + 'px');
        }
    }

    return {
        init: function(cameraAnimationHandler) {
            _cameraAnimationHandler = cameraAnimationHandler;
            _buildingObjects = [];
        },

        addTrackingObject: function(object) {
            var _element = $.parseHTML('<div class="tracking-overlay"></div>');
            var tracker = $('#threejs-container').append(_element);
            $(_element).on("click", function() {
                this.goToObject(object.mesh);
            }.bind(this));
            _trackers[object.mesh.id] = $(_element);
            _buildingObjects.push(object.mesh);
        },

        removeTrackingObject: function(object) {
            _buildingObjects = _.without(_buildingObjects, _.findWhere(_buildingObjects, object.mesh));
            _trackers[object.mesh.id].remove();
            _trackers.shift(object.mesh.id);
        },

        goToObject: function(mesh) {
            _cameraAnimationHandler.flyTo(mesh);
        },

        getTrackedObjects: function() {
            return _buildingObjects;
        },

        update: function() {
            _.each(_buildingObjects, function(value, key, list){
                // debugger
                trackPosition(value);
            });
        }
    }

});
