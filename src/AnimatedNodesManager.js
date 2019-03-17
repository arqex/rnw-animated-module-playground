let nodes = {};
let animatingTransforms = {};

let currentValues = {}


const AnimatedNodesManager = {
	createAnimatedNode: function( tag, config ){
		nodes[tag] = { ...config, children: [] }
	},
	connectAnimatedNodes: function( parentTag, childTag ){
		nodes[ parentTag ].push( childTag )
	},
	disconnectAnimatedNodes: function (parentTag, childTag) {
		removeFromChildren( parentTag, childTag )
	},
	connectAnimatedNodeToView: function( nodeTag, element ){
		nodes[ nodeTag ].views.push( element )
	},
	disconnectAnimatedNodeFromView: function( nodeTag, element ){
		removeFromChildren( nodeTag, element )
	},
	propagate: function( nodeTag, config ){
		let node = nodes[ nodeTag ]
		let nextAnimations = []

		if( node.type === 'value' ){
			if (config.type === 'frames') {
				let nextConfig = { ...config, values: framesToValue( config.frames, node.value, config.toValue ) };
				node.children.forEach( c => {
					nextAnimations.push(
						this.propagate( c, nextConfig )
					);
				});
			}
		}
		else if( node.type === 'interpolation' ){
			let parentValues = config.values;
			let values = parentValues.map( value => this.interpolate( value, node ) );
			let nextConfig = {...config, values};
			node.children.forEach(c => {
				nextAnimations.push(
					this.propagate(c, nextConfig)
				);
			})
			return nextAnimations;
		}
		else if( node.type === 'transform' ){
			let styleChange = { attrs: ['transform'],  }
			let nextConfig = { ...node, transform: nodeTag };
			animatingTransforms[ nodeTag ] = { config }
			let style = trans
		}
		else if( node.type === 'transform' ){

		}
		else if( node.type === 'style' ){
			let animation = this.propagate( node.children[0] );
			animation.prop = 'style';
			animation.attributes =
			return animation;
		}
		else if( node.type === 'props' ){
			return {
				view: node.children[0]
			}
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