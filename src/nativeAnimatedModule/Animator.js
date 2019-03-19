const Animator = {
	createAnimation: function( definitions ){
		let jsAnimations = [];
		definitions.forEach( def => {
			jsAnimations.push( 
				new Animation( new KeyframeEffect( def.view, ))
			})
		})
		
		return {
			start: function(){

			},
			stop: function(){

			},
			reset: function(){

			}
		}
	}
}

function createWebAnimation( definition ){

}