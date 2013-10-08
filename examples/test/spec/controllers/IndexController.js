define([
		'controllers/IndexController'
		],
		function( IndexController ) {

			describe('IndexController Controller', function () {

				it('should be an instance of IndexController Controller', function () {
					var indexcontroller = new IndexController();
					expect( indexcontroller ).to.be.an.instanceof( IndexController );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});
