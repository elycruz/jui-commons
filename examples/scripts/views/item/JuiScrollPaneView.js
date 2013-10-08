define([
	'backbone',
	'hbs!tmpl/item/JuiScrollPaneView'
],
function( Backbone, Juiscrollpaneview  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
			console.log("initialize a Juiscrollpaneview ItemView");
		},
		
    	template: Juiscrollpaneview,
        

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
