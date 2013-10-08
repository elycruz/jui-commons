define([
		'views/item/JuiScrollPaneView'
		],
		function( JuiScrollPaneView ) {

			describe('JuiScrollPaneView Itemview', function () {

				it('should be an instance of JuiScrollPaneView Itemview', function () {
					var juiscrollpaneview = new JuiScrollPaneView();
					expect( juiscrollpaneview ).to.be.an.instanceof( JuiScrollPaneView );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});
