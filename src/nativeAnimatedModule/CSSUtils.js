let ids = 0;

class CSSAnimation {
	constructor( view, duration, iterations ){
		super( super )
		this.id = 'nam_' + (ids++)
		this.view = view
		this.duration = duration
		this.iterations = iterations
	}

	start(){
		let style = this.view.style
		let animation = this.getStyleAnimation();
		if( style.animation ){
			style.animation += ', ' + this.getStyleAnimation()
		}
		else {
			style.animation = this.getStyleAnimation()
		}
	}

	stop(){

	}

	reset(){

	}
}