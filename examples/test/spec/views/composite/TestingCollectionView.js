(function() {
	'use strict';

	var root = this;

	root.define([
		'views/composite/TestingCollectionView'
		],
		function( Testingcollectionview ) {

			describe('Testingcollectionview Compositeview', function () {

				it('should be an instance of Testingcollectionview Compositeview', function () {
					var TestingCollectionView = new Testingcollectionview();
					expect( TestingCollectionView ).to.be.an.instanceof( Testingcollectionview );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );