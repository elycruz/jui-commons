(function() {
	'use strict';

	var root = this;

	root.define([
		'views/item/JuiSplitTextView'
		],
		function( Juisplittextview ) {

			describe('Juisplittextview Itemview', function () {

				it('should be an instance of Juisplittextview Itemview', function () {
					var JuiSplitTextView = new Juisplittextview();
					expect( JuiSplitTextView ).to.be.an.instanceof( Juisplittextview );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );