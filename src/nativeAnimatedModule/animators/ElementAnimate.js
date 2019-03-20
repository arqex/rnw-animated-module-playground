// This animator uses Element.animate that is supported by more browsers
// https://developers.google.com/web/updates/2014/05/Web-Animations-element-animate-is-now-in-Chrome-36


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
			frames: createKeyFrames( def.style, def.frameCount ),
			duration: Math.abs( def.frameCount / 60 * 1000 )
		}
	})
}

function createKeyFrames( styles, frameCount ){
	let keyFrames = [];

	for( let i = 0; i < frameCount; i++ ){
		let frame = {};
		for( let property in styles ){
			if( property === 'transform' ){
				let kf = ''

				for( let t in styles.transform ){
					kf += getTransform( t, styles.transform[t].values[i] )
				}

				frame.transform = kf
			}
			else {
				frame[ property ] = styles[property].values[i];
			}
		}

		keyFrames.push( frame );
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