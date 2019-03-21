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

const utils = {
	getTransform: function( type, value ){
		return type + '(' + value + units[type] + ') '
	},

	createKeyFrames: function( styles, frameCount ){
		let keyFrames = [];
	
		for( let i = 0; i < frameCount; i++ ){
			let frame = {};
			for( let property in styles ){
				if( property === 'transform' ){
					let kf = ''
	
					for( let t in styles.transform ){
						kf += this.getTransform( t, styles.transform[t].values[i] )
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
}

export default utils;