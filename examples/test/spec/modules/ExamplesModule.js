define([
		'modules/ExamplesModule'
		],
		function( ExamplesModule ) {

			describe('ExamplesModule Module', function () {

				it('should be an instance of ExamplesModule Module', function () {
					var examplesmodule = new ExamplesModule();
					expect( examplesmodule ).to.be.an.instanceof( ExamplesModule );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});
