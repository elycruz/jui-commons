define([
	'backbone',
	'hbs!tmpl/layout/main-layout'
],
function( Backbone, tmpl  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.Layout.extend({

        el: '#wrapper',

        initialize: function() {
			console.log("initialize a MainLayout Layout");
		},
		
    	template: tmpl,

    	/* Layout sub regions */
    	regions: {
            leftColRegion: '#left-col',
            mainColRegion: '#main-col',
            navRegion: '> nav'
        }

	});

});
