Creating a native driver for react-native-web? Browsers doesn't have a native side.

True. In this case, what we want is to make the JS implementation of Animated to run in the GPU when possible. In react-native, we just need to add `useNativeDriver: true` to our animation's config in order to take it to the native side. All the infrastructure is already there to let us plug some code and try to run the animations in the GPU just by adding that same line, so why don't we give it a try?

I have created a codesandbox to let anyone interested in give it a try. Also a repo in github with the same framework in case you like prefer to code locally.

I will be updating this article with the information I think is important to let any developer to get started.

How does Animated work internally?

I have started to go through Animated source code and learning about its internals. I won't get very deep in the explanation, but just to get a sense of how it works we need to know that it build a graph of different types of nodes, like values, transformations, or props. That graph is what makes Animated so flexible, the nodes are can be linked in many different ways so when we start an animation we can go from the value we want to animated, traversing the graph to apply the modifications to the value and finish in the view we want to update.

There is a great comment in the source code of animated that give us a quick idea on how it works:
```
/**
* Animated works by building a directed acyclic graph of dependencies
* transparently when you render your Animated components.
*
*               new Animated.Value(0)
*     .interpolate()        .interpolate()    new Animated.Value(1)
*         opacity               translateY      scale
*          style                         transform
*         View#234                         style
*                                         View#123
*
* A) Top Down phase
* When an Animated.Value is updated, we recursively go down through this
* graph in order to find leaf nodes: the views that we flag as needing
* an update.
*
* B) Bottom Up phase
* When a view is flagged as needing an update, we recursively go back up
* in order to build the new value that it needs. The reason why we need
* this two-phases process is to deal with composite props such as
* transform which can receive values from multiple parents.
*/
```

How does the native driver work?

I think the best way of learning is trying to achieve something. That's why I create the codesandbox with everything already set up, and we only need to implement the driver method to reach our goal: make it work.

In the sample app we can see a red square that, after 2 seconds, should start moving down. It's a very simple animation example.

We can describe the code and what we get from Animated in 3 steps:

1. First we create a value to animate and we get an AnimatedValue object:
```
AnimatedValue: {
	_animation: null
	_children: []
	_listeners: {}
	_offset: 0
	_startingValue: 300
	_value: 300
}
```
2. Later we render the Animated.View, using the value as a style property. That would update our AnimatedValue object, adding a hierarchy of children objects:
```
AnimatedValue: {
	_children: [
		AnimatedTransform: {
			_transforms: [{translateY: AnimatedValue}],
			_children: [
				AnimatedStyle: {
					_style: {
						backgroundColor: "red"
						height: 100
						transform: AnimatedTransform
						width: 100
					},
					_children: [
						AnimatedProps: {
							_animatedView: View,
							_props: {style: AnimatedStyle}
						}
					]
				}
			]
		}
	]
}
```

We can see the relations between nodes here:
Value -> Transform -> Style -> Props -> View

3. The last thing we do to get our animation working is creating the animation itself. We use a `timing` function and we get an object that is a container of functions that will rule our animation like `start`, `stop` and `reset`.

** The native part **

So far, all the models we have seen are JS ones. Our module will be also written in JS, but for the sake of making the difference from the internal Animated code I'll call it native. 

The native module is only used when we call animation's `start` method. At that point, the animation start passing information to us in order to let us handle the animation. First all the nodes are created using `createAnimatedNode`, and we need to start tracking them:

```
createAnimatedNode(4, {type: "value", value: 300, offset: 0})
createAnimatedNode(3, {type: "transform", transforms: [
	{type: "animated", property: "translateY", nodeTag: 4}
]})
createAnimatedNode(2, {type: "style", style: {transform: 3}})
createAnimatedNode(1, {type: "props", props: {style: 2}})
```

As we can see, we receive only the data related to the animation. For example, we don't have access to any other style information than the transform one.

Right after we receive the information to start building our graph through the `connectAnimatedNodes`. From parent to children we receive the links:

Value -> Transform -> Style -> Props

As we can see in the node creation data, we can go backwards in these relationships using the internal node's properties, from the Props to the Value(s).

There is one more link that we need to add to complete the graph, that is linking the Props node to our View. To do so animated calls our native method `connectAnimatedNodeToView` passing the node tag of our Props node: `1`, and the actual DOM node to animate:
```
<div class="css-view-1dbjc4n" style="background-color: rgb(255, 0, 0); height: 100px; transform: translateY(300px); width: 100px;"></div>
```
So we have direct access to the element in order to animate it.

The last piece of information that we are going to receive is "how do we need to animate the node". Our `startAnimatingNode` method is called and using `timing` we receive the progress for every frame of the animation:
```
{
	frames: (length 121) [0, 0.00025761027197557305, 0.0010119824303159884, 0.0022373076479458407, ...]
	iterations: 1
	toValue: 0
	type: "frames"
}
```

** Posible approaches to take the animation to GPU **

The frame data is calculated for a frame rate of 60 fps. From here we could calculate the value that our AnimatedValue would have for every frame, and create a CSS animation with 121 steps with those values. It sounds like a big chunk of code and we need to precalculate those values at the begining (a big load of processing), but it would be a very direct approach not difficult to implement.

Another approach would be infere the easing function applied from the frames given (since we don't have access to the function itseld) and use the equivalent CSS timing function. In this case the code would be simpler and the processing would be potentially smaller, but we wouldn't get the exact same animation that Animated pass to the driver.

The third approach that comes into my mind is using the web animation API, calling the `animate()` method directly in our DOM node:

https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats

This would be very straightforward, but as seen in other comments is not supported by all the browsers at the moment.

** Other animations **
Bad news is that the only animation that we get frame information from is the `timing` one. If we use a `spring` animation we get the following configuration in our `startAnimatingNode` method:
```
{
	damping: 22
	initialVelocity: 0
	iterations: 1
	mass: 1
	overshootClamping: false
	restDisplacementThreshold: 0.001
	restSpeedThreshold: 0.001
	stiffness: 230.2
	toValue: 300
	type: "spring"
}
```

To use the same aproaches mentioned above we will need to pre-calculate the progression frames by ourselves. We probably will be able to use some internal code in the JS Animated implementation to do so.

In `decay` animations is we receive also a different object in the native's `startAnimatingNode`, that we can handle by ourselves the same way we need to do it with `spring` ones:
```
	{type: "decay", deceleration: 0.998, velocity: 100, iterations: 1}
```


