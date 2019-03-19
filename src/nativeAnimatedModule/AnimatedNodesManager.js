// Here we are going to store the nodes
// Every node will contain their relationship with others
let nodes = {};

// Everytime we need to traverse the graph to create new animations
// we will reset this object, and temporarily save the animations here
// while calculating their frames.
// We are animating one AnimatedValue at a time, but it can be used to
// animated multiple views at once. The keys of this object would be the tags
// of the nodes to animate and the animation will have the view and the style
// properties to animate. { styleNodeTag: {style, view} }
let currentAnimations = {};

// A cache of the animated object passed to the `init` method.
let Animated;

const AnimatedNodesManager = {
	init( Ani ){
		Animated = Ani;
	},
	createAnimatedNode: function( tag, config ){
		nodes[tag] = { ...config, children: [] }
		if( config.type === 'interpolation' ){
			nodes[tag].interpolate = getInterpolation( config );
		}
	},
	connectAnimatedNodes: function( parentTag, childTag ){
		nodes[ parentTag ].children.push( childTag )
	},
	disconnectAnimatedNodes: function ( parentTag, childTag ) {
		removeFromChildren( parentTag, childTag )
	},
	connectAnimatedNodeToView: function( nodeTag, element ){
		nodes[ nodeTag ].children.push( element )
	},
	disconnectAnimatedNodeFromView: function( nodeTag, element ){
		removeFromChildren( nodeTag, element )
	},

	getAnimationDefinitions( valueTag, config ){
		currentAnimations = {};

		let animations = this.propagate( valueTag, config );
		let definitions = [];

		// The styles might have values that are not used by the animation of
		// the current AnimatedValue. Discard them.
		for( let styleTag in animations ){
			let style = animations[styleTag].style
			for( let property in style ){
				if( property === 'transform' ){
					let transform = style.transform
					for( let transformation in transform ){
						if( !isAnimated( transform[transformation] ) ){
							delete transform[transformation];
						}
					}
					if( Object.keys(transform).length === 0 ){
						delete style.transform;
					}
				}
				else {
					if( !isAnimated( style[property] ) ){
						delete style[property];
					}
				}
			}
			definitions.push( animations[styleTag] );
		}

		return definitions;
	},
	propagate: function( nodeTag, config ){
		let node = nodes[ nodeTag ]

		if( node.type === 'value' ){
			let nextConfig = { ...config, valueTag: nodeTag };
			if (config.type === 'frames') {
				nextConfig.values = framesToValue( config.frames, node.value, config.toValue );
				node.children.forEach( c => {
					let animation = this.propagate( c, nextConfig );
					if( animation.style ){
						Object.keys( animation.style ).forEach( property => {
							if( animation.style[property] === nodeTag ){
								animation.style[ property ] = config;
							}
						})
					}
				});
			}
			
			return currentAnimations;
		}
		else if( node.type === 'interpolation' ){
			let nextConfig = { ...config, valueTag: nodeTag };
			nextConfig.values = config.values.map( value => node.interpolate( value ) );

			node.children.forEach(c => {
				let animation = this.propagate( c, nextConfig );
				if( animation.style ){
					Object.keys( animation.style ).forEach( property => {
						if( animation.style[property] === nodeTag ){
							animation.style[ property ] = config;
						}
					})
				}
			})
			return currentAnimations;
		}
		else if( node.type === 'transform' ){
			// Get the animation from the style tag
			let animation = this.propagate( node.children[0], config );

			let transforms = {};
			node.transforms.forEach( t => {
				if( t.type === 'animated' && t.nodeTag === config.valueTag ){
					transforms[t.property] = config;
				}
				else {
					transforms[t.property] = t.nodeTag;
				}
			})
			
			animation.style.transform = transforms;
			return animation;
		}
		else if( node.type === 'style' ){
			if( currentAnimations[ nodeTag ] ){
				return currentAnimations[ nodeTag ]
			}

			// We just need the view now
			let animation = {
				style: {...node.style},
				// Style -> Props -> View - this are always 1 to 1 relationships
				view: nodes[ node.children[0] ].children[0]
			}

			currentAnimations[ nodeTag ] = animation;

			return animation;
		}
	}
}

export default AnimatedNodesManager

function framesToValue( frames, startValue, endValue ){
	return frames.map( f => (
		((endValue - startValue) * f) + startValue
	));
}

function removeFromChildren(nodeTag, child) {
	let children = nodes[nodeTag].children
	let idx = children.indexOf( child );
	if (idx !== -1) {
		children.splice(idx, 1);
	}
}

function getInterpolation( config ){
	return ( new Animated.Value(0) ).interpolate( config )._interpolation;
}

// Properties that have a numeric value (nodeTags) haven't been translated
// into animations
function isAnimated( value ){
	return isNaN(value);
}