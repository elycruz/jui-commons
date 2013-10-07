define([
		'models/TestingTesting123'
		],
		function( TestingTesting123 ) {

			describe('TestingTesting123 Model', function () {

				it('should be an instance of TestingTesting123 Model', function () {
					var testingtesting123 = new TestingTesting123();
					expect( testingtesting123 ).to.be.an.instanceof( TestingTesting123 );
				});

//				it('should have more test written', function(){
//					expect( false ).to.be.ok;
//				});
			});

		});
