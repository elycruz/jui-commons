define([
	'backbone',
	'hbs!tmpl/item/jui-scroll-pane-view'
],
function( Backbone, tmpl ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
        },
		
    	template: tmpl,

        onShow: function () {
            $('.content-pane', this.$el).juiScrollPane();
        }
	});

});
