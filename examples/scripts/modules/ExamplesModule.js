define([
    'application'
], function(app) {

	'use strict';

    app.module('ExamplesModule', function(mod, app) {
        mod.addInitializer(function() {
	        console.log('ExamplesModule has been initialized.');
        });
    });

    return app.module('ExamplesModule');
});