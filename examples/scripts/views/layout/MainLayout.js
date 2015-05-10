define([
	'backbone',
    'backbone.marionette'
],
function( Backbone ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.Layout.extend({

        el: '#wrapper',

        initialize: function() {
//			console.log("initialize a MainLayout Layout");
		},
		
    	/* Layout sub regions */
    	regions: {
            leftColRegion: '#left-col',
            mainColRegion: '#main-col',
            navRegion: '> nav'
        }

	});

});
