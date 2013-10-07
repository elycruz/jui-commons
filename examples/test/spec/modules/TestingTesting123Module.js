define([
    'application',
		'modules/TestingTesting123Module'
		],
		function( app, TestingTesting123Module ) {

			describe('TestingTesting123Module Module', function () {

				it('should equal TestingTesting123Module Module', function () {
					var testingtesting123module = app.TestingTesting123Module;
					expect( testingtesting123module ).to.equal( TestingTesting123Module );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});
