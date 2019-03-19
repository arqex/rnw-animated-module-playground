import './nativeAnimatedModule/NativeAnimatedModule';
import React, { Component } from "react";
import { StyleSheet, View, Animated } from "react-native";

let animatedValue = new Animated.Value(0);
let animatedOpacity = animatedValue.interpolate({
    inputRange: [0, 300],
    outputRange: [1, .5]
})

let animatedScale = new Animated.Value(1);

class App extends Component {
    render() {
        let animatedStyles = [
            styles.square,
            { transform: [{ translateY: animatedValue }, { scale: animatedScale}], opacity: animatedOpacity }
        ];
        return (
            <View style={styles.app}>
                <Animated.View style={animatedStyles} />
            </View>
        );
    }

    componentDidMount() {
        // Start the scale animation
        Animated.timing( animatedScale, {
            toValue: 1.5,
            duration: 4000,
            iterations: Infinity,
            useNativeDriver: true
        }).start();

        setTimeout(() => {
            let ani = Animated.timing(animatedValue, {
                toValue: 300,
                duration: 2000,
                useNativeDriver: true
            })
            
            /*
            let ani = Animated.spring(animatedValue, {
                toValue: 300,
                duration: 2000,
                useNativeDriver: true
            })
            */

            /*
            let ani = Animated.decay(animatedValue, {
                velocity: 100,
                isInteraction: false,
                useNativeDriver: true
            })
            */

            ani.start()
        }, 2000 )
    }
}

const styles = StyleSheet.create({
    app: {
        marginHorizontal: "auto",
        maxWidth: 500
    },
    square: {
        width: 100,
        height: 100,
        backgroundColor: "red"
    }
});

export default App;
