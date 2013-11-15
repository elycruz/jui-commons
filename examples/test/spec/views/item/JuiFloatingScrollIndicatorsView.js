define([
		'views/item/JuiFloatingScrollIndicatorsView'
		],
		function( JuiFloatingScrollIndicatorsView ) {

			describe('JuiFloatingScrollIndicatorsView Itemview', function () {

				it('should be an instance of JuiFloatingScrollIndicatorsView Itemview', function () {
					var juifloatingscrollindicatorsview = new JuiFloatingScrollIndicatorsView();
					expect( juifloatingscrollindicatorsview ).to.be.an.instanceof( JuiFloatingScrollIndicatorsView );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});
