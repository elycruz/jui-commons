require([
	'backbone',
	'application',
	'regionManager',
    'jquery',
    'jquery-ui',
    'TweenMax',
    'jui-commons',
    'mustache'
],
function ( Backbone, App ) {
    'use strict';
    Backbone.history.start();
	App.start();
});
