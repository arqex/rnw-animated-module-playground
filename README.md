# React Native Web - Native Animated Module

This is a boilerplate project to work on creating a native module for animated in the browsers. There aren't really native modules for react-native-web, but it would be great if we could implement the NativeAnimatedModule interface in the browser, so we can make the animations run in the GPU just by adding `useNativeDriver: true` in our animations.

More about this idea and the development:
https://www.reddit.com/r/reactnative/comments/b12skv/idea_native_animated_driver_for_react_native_web

Bootstrapped with https://github.com/joefazz/react-native-web-starter

## Installation
```

```

## Get Started

Clone the branch with the starting point you want and just rename the project (don't forget the `package.json`, Run `git remote rm origin && yarn` to remove the ref to this repo and install node_modules then you're good to go. 🙂

A full list of the scripts defined in `package.json` is shown below.

| Script              | Action                                                  |
| ------------------- | ------------------------------------------------------- |
| `yarn web`          | Start CRA Development Build                             |
| `yarn build-web`    | Create production build for web                         |
| `yarn eject-web`    | Eject from CRA                                          |
| `yarn start-native` | Start the Expo packager                                 |
| `yarn eject-native` | Eject from Expo                                         |
| `yarn android`      | Start expo packager and install app to Android Emulator |
| `yarn ios`          | Start expo packager and install app to iOS Simulator    |
| `yarn test-native`  | Run testing script for mobile app                       |
| `yarn test-web`     | Run testing script for web app                          |
| `yarn test`         | Run both testing scripts                                |

