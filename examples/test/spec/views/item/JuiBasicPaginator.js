(function() {
	'use strict';

	var root = this;

	root.define([
		'views/item/JuiBasicPaginator'
		],
		function( Juibasicpaginator ) {

			describe('Juibasicpaginator Itemview', function () {

				it('should be an instance of Juibasicpaginator Itemview', function () {
					var JuiBasicPaginator = new Juibasicpaginator();
					expect( JuiBasicPaginator ).to.be.an.instanceof( Juibasicpaginator );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );