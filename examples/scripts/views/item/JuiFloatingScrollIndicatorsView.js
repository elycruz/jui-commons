define([
	'backbone',
	'stache!tmpl/item/jui-floating-scroll-indicators-view',
    'TweenMax',
    'gsap-scrollto-plugin'

],
function( Backbone, JuiFloatingScrollIndicatorsView  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
		},
		
    	template: JuiFloatingScrollIndicatorsView,

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on show callback */
		onShow: function() {
            var indTestElm = $('.floating-scroll-indicators-test')
                .juiFloatingScrollIndicators();
        }
	});

});
