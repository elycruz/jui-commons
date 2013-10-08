define([
		'views/item/WelcomeItemView'
		],
		function( WelcomeItemView ) {

			describe('WelcomeItemView Itemview', function () {

				it('should be an instance of WelcomeItemView Itemview', function () {
					var welcomeitemview = new WelcomeItemView();
					expect( welcomeitemview ).to.be.an.instanceof( WelcomeItemView );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});
