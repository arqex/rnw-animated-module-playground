let nodes = {};

const AnimatedNodesManager = {
	createAnimatedNode: function( tag, config ){
		nodes[tag] = { ...config, children: [], parents:[] }
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
				console.log( nextConfig )
			}
			/*
			let nextConfig = { ...config, };
			node.children.forEach( child => {
				nextAnimations.push(this.propagate(childTag, nextConfig, animations ) )
			})
			*/
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