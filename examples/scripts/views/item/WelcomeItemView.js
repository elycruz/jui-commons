define([
	'backbone',
	'hbs!tmpl/welcome'
],
function( Backbone, tmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
			console.log("initialize a Welcomeitemview ItemView");
		},
		
    	template: tmpl,

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
