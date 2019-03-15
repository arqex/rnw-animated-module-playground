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
		console.warn(
			"NativeAnimatedModule for web: connectAnimatedNodes method not implemented.",
			parentTag,
			childTag
		);
	},
	disconnectAnimatedNodes: function (parentTag, childTag) {
		console.warn(
			"NativeAnimatedModule for web: disconnectAnimatedNodes method not implemented.",
			parentTag,
			childTag
		);
	},
	startAnimatingNode: function (animationId, nodeTag, config, endCallback) {
		manager.propagate( nodeTag, config )
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
		console.warn(
			"NativeAnimatedModule for web: connectAnimatedNodeToView method not implemented.",
			nodeTag,
			viewTag
		);
	},
	disconnectAnimatedNodeFromView: function (nodeTag, viewTag) {
		console.warn(
			"NativeAnimatedModule for web: disconnectAnimatedNodeFromView method not implemented.",
			nodeTag,
			viewTag
		);
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
