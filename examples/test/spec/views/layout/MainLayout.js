define([
		'views/layout/MainLayout'
		],
		function( MainLayout ) {

			describe('MainLayout Layout', function () {

				it('should be an instance of MainLayout Layout', function () {
					var mainlayout = new MainLayout();
					expect( mainlayout ).to.be.an.instanceof( MainLayout );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});
