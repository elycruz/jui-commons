define([
	'backbone',
	'hbs!tmpl/item/jui-affix-view'
],
function( Backbone, tmpl ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

    	template: tmpl,

        className: 'jui-affix-example',

        ui: {
            elmToAffix: '.element-to-affix'
        },

        onShow: function () {
            var self = this,
                elmToAffix = self.ui.elmToAffix;
            $('.content-pane > .content', self.$el).css('overflow', 'scroll');
//            $('.content-pane', self.$el).juiScrollPane();
            $('#wrapper > nav').juiAffix({
                offset: {top: 0},
                scrollableElm: $(window)
            });
            elmToAffix.juiAffix({
                offset: {bottom: 10},
                scrollableElm: $(window)
            });
        }
	});

});
