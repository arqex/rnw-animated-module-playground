// This animator uses CSS animations, cross-browser support is really nice for it


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
					kf += getTransform( t, styles.transform[t].values[i] )
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

function setAnimationsIntoDOM( animations ){
	let styleContent = ''
	animations.forEach( ani => {
		styleContent += ani.keyframes;
	})

	let style = document.createElement('style');
	style.innerHTML = styleContent;
	document.head.appendChild( style );
}