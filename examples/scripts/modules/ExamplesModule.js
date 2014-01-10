define([
    'application'
], function(app) {

	'use strict';

    app.module('ExamplesModule', function(mod, app) {
        mod.addInitializer(function() {
        });
    });

    return app.module('ExamplesModule');
});