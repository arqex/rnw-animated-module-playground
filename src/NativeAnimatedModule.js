// HACK: importing the internal version of Native
import NativeModules from "react-native/dist/exports/NativeModules/index";
import manager from './AnimatedNodesManager'

const driver = {
	createAnimatedNode: function (tag, config) {
		console.log('Creating node', tag, config )
		manager.createAnimatedNode( tag, config )
	},
	startListeningToAnimatedNodeValue: function (tag) {
		console.warn(
			"NativeAnimatedModule for web: startListeningToAnimatedNodeValue method not implemented.",
			tag
		);
	},
	stopListeningToAnimatedNodeValue: function (tag) {
		console.warn(
			"NativeAnimatedModule for web: stopListeningToAnimatedNodeValue method not implemented.",
			tag
		);
	},
	connectAnimatedNodes: function (parentTag, childTag) {
		console.log('Connecting nodes', parentTag, childTag )
		manager.connectAnimatedNodes( parentTag, childTag )
	},
	disconnectAnimatedNodes: function (parentTag, childTag) {
		console.warn(
			"NativeAnimatedModule for web: disconnectAnimatedNodes method not implemented.",
			parentTag,
			childTag
		);
	},
	startAnimatingNode: function (animationId, nodeTag, config, endCallback) {
		let animations = manager.propagate( nodeTag, config )
		console.log( animations )
		console.warn(
			"NativeAnimatedModule for web: startAnimatingNode method not implemented.",
			animationId,
			nodeTag,
			config,
			endCallback
		);
	},
	stopAnimation: function (animationId) {
		console.warn(
			"NativeAnimatedModule for web: stopAnimation method not implemented.",
			animationId
		);
	},
	setAnimatedNodeValue: function (nodeTag, value) {
		console.warn(
			"NativeAnimatedModule for web: setAnimatedNodeValue method not implemented.",
			nodeTag,
			value
		);
	},
	setAnimatedNodeOffset: function (nodeTag, offset) {
		console.warn(
			"NativeAnimatedModule for web: setAnimatedNodeOffset method not implemented.",
			nodeTag,
			offset
		);
	},
	flattenAnimatedNodeOffset: function (nodeTag) {
		console.warn(
			"NativeAnimatedModule for web: flattenAnimatedNodeOffset method not implemented.",
			nodeTag
		);
	},
	extractAnimatedNodeOffset: function (nodeTag) {
		console.warn(
			"NativeAnimatedModule for web: extractAnimatedNodeOffset method not implemented.",
			nodeTag
		);
	},
	connectAnimatedNodeToView: function (nodeTag, viewTag) {
		console.log('Connecting node and view', nodeTag, viewTag )
		manager.connectAnimatedNodes( nodeTag, viewTag )
	},
	disconnectAnimatedNodeFromView: function (nodeTag, viewTag) {
		console.log('Connecting node and view', nodeTag, viewTag )
		manager.connectAnimatedNodes( nodeTag, viewTag )
	},
	dropAnimatedNode: function (tag) {
		console.warn(
			"NativeAnimatedModule for web: dropAnimatedNode method not implemented.",
			tag
		);
	},
	addAnimatedEventToView: function (viewTag, eventName, eventMapping) {
		console.warn(
			"NativeAnimatedModule for web: addAnimatedEventToView method not implemented.",
			viewTag,
			eventName,
			eventMapping
		);
	},
	removeAnimatedEventFromView: function (viewTag, eventName, animatedNodeTag) {
		console.warn(
			"NativeAnimatedModule for web: removeAnimatedEventFromView method not implemented.",
			viewTag,
			eventName,
			animatedNodeTag
		);
	}
};

NativeModules.NativeAnimatedModule = driver;

// HACK: importing Animated I can access to internal functions, like interpolation,
// ideally I should add the interpolate code to the library or ask react-native-web to export it for me
let Animated = require('react-native').Animated;
manager.init( Animated );
