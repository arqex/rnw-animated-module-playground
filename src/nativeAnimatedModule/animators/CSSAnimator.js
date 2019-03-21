// This animator uses CSS animations, cross-browser support is really nice for it
// It creates the @keyframes definition and appends it to the page <head>

import utils from '../NAMUtils'


// We will probably want create a class for the Animations,
// so we can share the methods in the prototype among animation instances
const Animator = {
	createAnimation: function( definitions ){
		let cssAnimations = createCSSAnimations( definitions );

		setAnimationsIntoDOM( cssAnimations );
		
		return {
			animations: cssAnimations, // just for debug purposes
			start: function(){
				cssAnimations.forEach( ani => {
					ani.view.style.animation = `${ ani.id } ${ ani.duration / 1000 }s`
				})
			},
			stop: function () {
				// Not implemented
			},
			reset: function(){
				// Not implemented
			}
		}
	}
}

export default Animator;

let animationCount = 0;
function createCSSAnimations( definitions ){
	return definitions.map( def => {
		let id = 'nam_' + (animationCount++);

		return {
			id,
			view: def.view,
			keyframes: `@keyframes ${id} { ${createKeyFrames( def.style, def.frameCount )} }`,
			duration: Math.abs( def.frameCount / 60 * 1000 )
		}
	})
}

function createKeyFrames( styles, frameCount ){
	let keyFrames = '';

	for( let i = 0; i < frameCount; i++ ){
		let frame = i / frameCount * 100 + '% {';
		for( let property in styles ){
			if( property === 'transform' ){
				let kf = 'transform: '

				for( let t in styles.transform ){
					kf += utils.getTransform( t, styles.transform[t].values[i] )
				}

				frame += kf + ';\n'
			}
			else {
				frame += `${property}: ${styles[property].values[i]};\n`;
			}
		}

		keyFrames += frame + `}\n`;
	}

	return keyFrames;
}

function setAnimationsIntoDOM( animations ){
	let styleContent = ''
	animations.forEach( ani => {
		styleContent += ani.keyframes;
	})

	let style = document.createElement('style');
	style.innerHTML = styleContent;
	document.head.appendChild( style );
}