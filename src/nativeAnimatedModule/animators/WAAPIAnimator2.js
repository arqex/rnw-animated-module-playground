// This animator tries to use the second syntax specified in
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
// for creating the animation object that we can start, stop and reset
// It doesn't work very well. Only firefox can move the object without really animating the movement

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
				createKeyFrames( def.style, def.frameCount ),
				{ duration, fill: 'forwards'} 
			)
		)
	})
}

function createKeyFrames( style, frameCount ){
	let keyFrames = {}
	for( let property in style ){
		if( property === 'transform' ){
			let transform = style.transform
			let frames = []
			for( let i = 0; i < frameCount; i++ ){
				let kf = ''
				for( let t in transform ){
					kf += getTransform( t, transform[t].values[i] )
				}
				frames.push( kf )
			}
			keyFrames.transform = frames;
		}
		else {
			keyFrames[ property ] = style[property].values;
		}
	}
	return keyFrames;
}

const units = {
	rotate: '',
	rotateX: '',
	rotateY: '',
	rotateZ: '',
	scale: '',
	scaleX: '',
	scaleY: '',
	translateX: 'px',
	translateY: 'px',
	skewX: '',
	skewY: ''
}

function getTransform( type, value ){
	return type + '(' + value + units[type] + ') '
}