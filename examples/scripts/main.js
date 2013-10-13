require([
	'backbone',
	'application',
	'regionManager',
    'modules/ExamplesModule',
    'jquery',
    'jquery-ui',
    'TweenMax',
    'jui-commons'

],
function ( Backbone, App ) {
    'use strict';
    Backbone.history.start();
	App.start();
});
