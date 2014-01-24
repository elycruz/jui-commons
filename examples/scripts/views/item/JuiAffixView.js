define([
	'backbone',
	'hbs!tmpl/item/jui-affix-view'
],
function( Backbone, tmpl ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

    	template: tmpl,

        onShow: function () {
            var self = this;
            $('.content-pane', self.$el).juiScrollPane();
            $('.element-to-affix', self.$el).juiAffix({
                scrollableElm: $('.nested-content-panes > .content', self.$el)
            });
        }
	});

});
