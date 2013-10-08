define([
		'views/item/JuiScrollbarView'
		],
		function( JuiScrollbarView ) {

			describe('JuiScrollbarView Itemview', function () {

				it('should be an instance of JuiScrollbarView Itemview', function () {
					var juiscrollbarview = new JuiScrollbarView();
					expect( juiscrollbarview ).to.be.an.instanceof( JuiScrollbarView );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});
