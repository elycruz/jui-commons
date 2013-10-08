define([
	'backbone',
	'hbs!tmpl/item/JuiScrollableDropDownView'
],
function( Backbone, Juiscrollabledropdownview  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
			console.log("initialize a Juiscrollabledropdownview ItemView");
		},
		
    	template: Juiscrollabledropdownview,
        

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
