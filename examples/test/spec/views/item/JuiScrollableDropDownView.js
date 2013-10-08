define([
		'views/item/JuiScrollableDropDownView'
		],
		function( JuiScrollableDropDownView ) {

			describe('JuiScrollableDropDownView Itemview', function () {

				it('should be an instance of JuiScrollableDropDownView Itemview', function () {
					var juiscrollabledropdownview = new JuiScrollableDropDownView();
					expect( juiscrollabledropdownview ).to.be.an.instanceof( JuiScrollableDropDownView );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});
