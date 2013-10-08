require([
	'backbone',
	'application',
	'regionManager',
    'modules/ExamplesModule'

],
function ( Backbone, App ) {
    'use strict';
    Backbone.history.start();
	App.start();
});
