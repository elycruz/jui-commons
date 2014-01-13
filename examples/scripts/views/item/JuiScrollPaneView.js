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

        scrollPane1: null,

        onShow: function () {
            var self = this;
            $('.toggle-example-1-state').click(function () {
                if (!empty(self.scrollPane1)) {
                    self.scrollPane1.juiScrollPane('destroy');
                    self.scrollPane1 = null;
                }
                else {
                    self.scrollPane1 =
                        $('.content-pane', self.$el).juiScrollPane();
                }
            });
        }
	});

});
