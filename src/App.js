import './NativeAnimatedModule';
import React, { Component } from "react";
import { StyleSheet, View, Animated } from "react-native";

let animatedValue = new Animated.Value(0);

class App extends Component {
    render() {
        let animatedStyles = [
            styles.square,
            { transform: [{ translateY: animatedValue }] }
        ];
        return (
            <View style={styles.app}>
                <Animated.View style={animatedStyles} />
            </View>
        );
    }

    componentDidMount() {
        setTimeout(
            () =>
                Animated.timing(animatedValue, {
                    toValue: 300,
                    duration: 2000,
                    useNativeDriver: true
                }).start(),
            2000
        );
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
