define([
		'views/item/JuiSelectPickerView'
		],
		function( JuiSelectPickerView ) {

			describe('JuiSelectPickerView Itemview', function () {

				it('should be an instance of JuiSelectPickerView Itemview', function () {
					var juiselectpickerview = new JuiSelectPickerView();
					expect( juiselectpickerview ).to.be.an.instanceof( JuiSelectPickerView );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});
