define([
	'backbone',
	'hbs!tmpl/item/jui-scroll-pane-view'
],
function( Backbone, tmpl ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

    	template: tmpl,

        scrollPanes: null,

        ui: {
            toggleCreationStateBtn: '.toggle-creation-destruction-state',
            toggleMimickBrowserBtn: '.toggle-mimick-browser'
        },

        onShow: function () {
            var self = this;

            self.ui.toggleCreationStateBtn.click(function () {
                if (!empty(self.scrollPanes)) {
                    self.scrollPanes.juiScrollPane('destroy');
                    self.scrollPanes = null;
                }
                else {
                    self.scrollPanes =
                        $('.content-pane', self.$el).juiScrollPane({mimickBrowser: true});
                }
            });

            self.ui.toggleMimickBrowserBtn.click(function () {
                if (empty(self.scrollPanes)) {
                    self.ui.toggleCreationStateBtn.trigger('click');
                }
                var currVal = self.scrollPanes.juiScrollPane('option', 'mimickBrowser');
                self.scrollPanes.juiScrollPane('option', 'mimickBrowser', (currVal === true ? false : true));
                console.log(currVal);
            })
        }
	});

});
