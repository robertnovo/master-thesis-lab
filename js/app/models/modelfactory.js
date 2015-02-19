define(function(require) {

    var BuildingModel = require('models/buildingmodel');
    var GroundModel = require('models/groundmodel');

    var models = {
        'building': BuildingModel,
        'ground': GroundModel
    };

    return {
        createObject: function(options) {
            if(models[options.type]) {
                return new models[options.type](options);
            } else {
                console.error("undefined model, check spellning!", options.type);
                return;
            }
        }
    }
});
