let ids = 0;

const SEPARATOR = ', '

class CSSAnimation {
	constructor( view, duration, iterations ){
		super()
		
		this.view = view;
		this.animation = {
			name: 'nam_' + (ids++),
			duration,
			timing: 'linear',
			delay: '0',
			iterations: iterations,
			direction: 'normal',
			fill: 'both',
			playState: 'initial'
		}

		this._addAnimationToView()
	}

	start(){
		this._updateAnimation({playState: 'running'})
	}

	stop() {
		this._updateAnimation({ playState: 'paused' })
	}

	reset() {
		this._updateAnimation({ playState: 'initial' })
	}

	_addAnimationToView(){
		this._updateAnimation();
	}

	_removeAnimationFromView(){
		let animations = this._getViewAnimations()
		if( animations.currentIndex !== false ){
			animations.list.splice( animations.currentIndex, 1 )
			this._setViewAnimations(animations.list)
		}		
	}

	_updateAnimation( update = {} ){
		let nextAnimation = this._getCSSAnimation({ ...this.animation, update })
		let animations = this._getViewAnimations()

		if( animations.currentIndex !== false ){
			animations.list[ animations.currentIndex ] = nextAnimation
		}
		else {
			animations.list.push( nextAnimation )
		}

		this._setViewAnimations( animations.list )
	}

	_getViewAnimations(){
		let list = (this.view.style.animation || '').split(/\s*,\s*/)
		let i = 0;
		let index = false;

		while( index === false && i < list.length ){
			if( list[i].indexOf( this.animation.name ) === 0 ){
				index = i
			}
			i++;
		}

		return {
			list: list,
			currentIndex: index
		}
	}

	_setViewAnimations( list ){
		this.view.style.animations = list.join(SEPARATOR);
	}
}