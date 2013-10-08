define([
	'backbone',
	'communicator',
    'routers/Router',
	'hbs!tmpl/welcome'
],

function( Backbone, Communicator, Router, Welcome_tmpl ) {
    'use strict';

	var welcomeTmpl = Welcome_tmpl;

	var app = new Backbone.Marionette.Application();

	/* Add application regions here */
//	app.addRegions({});

    /** Router **/
    app.router = new Router();

	/* Add initializers here */
//	app.addInitializer( function () {
//    });

    return app;
});
