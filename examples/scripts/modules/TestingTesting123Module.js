define([
    'application'
], function(app) {

	'use strict';

    app.module('TestingTesting123Module', function(mod, app) {
        mod.addInitializer(function() {
        });
    });

    return app.module('TestingTesting123Module');
});