// This animator uses Element.animate that is supported by more browsers
// https://developers.google.com/web/updates/2014/05/Web-Animations-element-animate-is-now-in-Chrome-36

import utils from '../NAMUtils'


// We will probably want create a class for the Animations,
// so we can share the methods in the prototype among animation instances
const Animator = {
	createAnimation: function( definitions ){
		let frameDescriptions = createWebAnimations( definitions );
		let animations = [];
		
		return {
			animations: frameDescriptions, // just for debug purposes
			start: function(){
				if( animations.length ){
					animations.forEach( ani => ani.play() )
				}
				else {
					animations = frameDescriptions.map( desc => {
						return desc.view.animate( desc.frames, {duration: desc.duration})
					})
				}
			},
			stop: function () {
				animations.forEach(ani => ani.pause())
			},
			reset: function(){
				animations.forEach( ani => ani.stop())
			}
		}
	}
}

export default Animator;
function createWebAnimations( definitions ){
	return definitions.map( def => {
		return {
			view: def.view,
			frames: utils.createKeyFrames( def.style, def.frameCount ),
			duration: Math.abs( def.frameCount / 60 * 1000 )
		}
	})
}