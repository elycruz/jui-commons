define([
	'backbone',
	'hbs!tmpl/item/JuiScrollbarView'
],
function( Backbone, Juiscrollbarview  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
			console.log("initialize a Juiscrollbarview ItemView");
		},
		
    	template: Juiscrollbarview,
        

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
