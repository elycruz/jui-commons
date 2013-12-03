(function() {
	'use strict';

	var root = this;

	root.define([
		'collections/TestingCollection'
		],
		function( Testingcollection ) {

			describe('Testingcollection Collection', function () {

				it('should be an instance of Testingcollection Collection', function () {
					var TestingCollection = new Testingcollection();
					expect( TestingCollection ).to.be.an.instanceof( Testingcollection );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );