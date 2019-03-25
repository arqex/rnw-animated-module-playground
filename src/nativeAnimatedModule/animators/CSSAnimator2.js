import utils from '../NAMUtils'

let ids = 0;

const SEPARATOR = ', '
const ANIMATION_PARTS = ['name', 'duration', 'timing', 'delay', 'iterations', 'direction', 'fill']

export default class CSSAnimation {
	constructor( definitions ){
		
		this.animations = {};

		definitions.forEach( def => {
			let id = 'nam_' + (ids++);

			let ani = {
				id: id,
				view: def.view,
				style: def.style,
				frameCount: def.frameCount,
				properties: {
					name: id,
					duration: Math.abs( def.frameCount / 60 ) + 's',
					timing: 'linear',
					delay: '0s',
					iterations: 1,
					direction: 'normal',
					fill: 'both',
					playState: 'initial'
				}
			};

			this.animations[ id ] = ani
			this._addAnimationToView( ani )
		})

		this._setKeyFrames( this.animations )
	}

	start(){
		for( let id in this.animations ){
			this._updateAnimation( this.animations[id], {playState: 'running'})
		}
	}

	stop() {
		for( let id in this.animations ){
			this._updateAnimation( this.animations[id], { playState: 'paused' })
		}
	}

	reset() {
		for( let id in this.animations ){
			this._updateAnimation( this.animations[id], { playState: 'initial' })
		}
	}

	_setKeyFrames( animations ){
		let keyframes = Object.keys( animations ).map( id => (
			`@keyframes ${id} { ${ this._createKeyFrames( animations[id].style, animations[id].frameCount ) } }`
		))

		this._setAnimationsIntoDOM( keyframes )
	}

	_setAnimationsIntoDOM( keyframes ){
		let styleContent = ''
		keyframes.forEach( kf => {
			styleContent += kf;
		})
	
		let style = document.createElement('style');
		style.innerHTML = styleContent;
		document.head.appendChild( style );
	}
	

	_createKeyFrames( styles, frameCount ){
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

	_addAnimationToView( ani ){
		this._updateAnimation( ani );
	}

	_removeAnimationFromView(){
		this.animations.forEach( ani => {
			let animations = this._getViewAnimations( ani )
			if( animations.currentIndex !== false ){
				animations.list.splice( animations.currentIndex, 1 )
				this._setViewAnimations( ani.view, animations.list)
			}
		})
	}

	_updateAnimation( ani, update = {} ){
		let nextAnimation = this._getCSSAnimation({ ...ani.properties, update })
		let animations = this._getViewAnimations( ani )

		if( animations.currentIndex !== false ){
			animations.list[ animations.currentIndex ] = nextAnimation
		}
		else {
			animations.list.push( nextAnimation )
		}

		this._setViewAnimations( ani.view, animations.list )
	}

	_getViewAnimations( animation ){
		let styleAnimation = animation.view.style.animation;
		let list = styleAnimation ? styleAnimation.split(/\s*,\s*/) : [];
		let i = 0;
		let index = false;

		while( index === false && i < list.length ){
			if( list[i].indexOf( animation.id ) === 0 ){
				index = i
			}
			i++;
		}

		return {
			list: list,
			currentIndex: index
		}
	}

	_setViewAnimations( view, list ){
		console.log( list.join(SEPARATOR) );
		view.style.animation = list.join(SEPARATOR);
	}

	_getCSSAnimation( properties ){
		return ANIMATION_PARTS.map( p => properties[p] ).join(' ')
	}
}