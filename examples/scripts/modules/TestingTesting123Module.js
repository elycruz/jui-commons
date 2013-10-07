define([
    'application'
], function(app) {

	'use strict';

    app.module('TestingTesting123Module', function(mod, app) {
        mod.addInitializer(function() {
	        console.log('TestingTesting123Module has been initialized.');
        });
    });

    return app.module('TestingTesting123Module');
});