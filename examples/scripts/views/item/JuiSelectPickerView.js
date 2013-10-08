define([
	'backbone',
	'hbs!tmpl/item/JuiSelectPickerView'
],
function( Backbone, Juiselectpickerview  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
			console.log("initialize a Juiselectpickerview ItemView");
		},
		
    	template: Juiselectpickerview,
        

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
