(function() {
	'use strict';

	var root = this;

	root.define([
		'views/composite/TestingCompositeView'
		],
		function( Testingcompositeview ) {

			describe('Testingcompositeview Compositeview', function () {

				it('should be an instance of Testingcompositeview Compositeview', function () {
					var TestingCompositeView = new Testingcompositeview();
					expect( TestingCompositeView ).to.be.an.instanceof( Testingcompositeview );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );