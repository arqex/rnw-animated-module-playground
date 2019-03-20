const Animator = {
	createAnimation: function( definitions ){
		let webAnimations = createWebAnimations( definitions );
		
		return {
			start: function(){
				webAnimations.forEach( ani => ani.start() )
			},
			stop: function () {
				webAnimations.forEach(ani => ani.pause())
			},
			reset: function(){
				this.stop()
				webAnimations = createWebAnimations(definitions)
			}
		}
	}
}

function createWebAnimations( definitions ){
	let webAnimations = definitions.map( def => {
		let keyFrames = {}
		for( let property in def.style ){
			if( property === 'transform' ){
				let transform = def.style.transform
				for( let t in transform ){
					
				}
			}
			else {
				keyFrames[ property ] = def.style[property].values;
			}
		}
	})
}