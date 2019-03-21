// This animator tries to use the first syntax specified in
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
// for creating the animation object that we can start, stop and reset
// It doesn't work very well. Only firefox can move the object. Animations don't add up

import utils from '../NAMUtils'

// We will probably want create a class for the Animations,
// so we can share the methods in the prototype among animation instances
const Animator = {
	createAnimation: function( definitions ){
		let webAnimations = createWebAnimations( definitions );
		
		return {
			animations: webAnimations, // just for debug purposes
			start: function(){
				webAnimations.forEach( ani => ani.play() )
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

export default Animator;
function createWebAnimations( definitions ){
	return definitions.map( def => {
		let duration = Math.abs( def.frameCount / 60 * 1000 );

		return new Animation(
			new KeyframeEffect(
				def.view,
				utils.createKeyFrames( def.style, def.frameCount ),
				{ duration, fill: 'forwards'} 
			)
		)
	})
}