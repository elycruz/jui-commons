define([
		'controllers/BaseController'
		],
		function( BaseController ) {

			describe('BaseController Controller', function () {

				it('should be an instance of BaseController Controller', function () {
					var basecontroller = new BaseController();
					expect( basecontroller ).to.be.an.instanceof( BaseController );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});
