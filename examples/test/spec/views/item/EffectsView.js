define([
		'views/item/EffectsView'
		],
		function( EffectsView ) {

			describe('EffectsView Itemview', function () {

				it('should be an instance of EffectsView Itemview', function () {
					var effectsview = new EffectsView();
					expect( effectsview ).to.be.an.instanceof( EffectsView );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});
