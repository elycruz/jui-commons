define([
	'backbone',
	'communicator',
    'routers/Router',
    'controllers/IndexController'
],
function( Backbone, Communicator, Router, IndexController ) {
    'use strict';

	var app = new Backbone.Marionette.Application();

    app.router = new Router();

    app.indexController = new IndexController();

    return app;
});
