import { useState } from "react";
import { Text, View, Dimensions, StyleSheet, TextInput, Pressable } from "react-native";
import s from "./style";
import Svg, { Image, Ellipse, ClipPath } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  withDelay,
  runOnJS,
  withSequence,
  withSpring,
} from "react-native-reanimated";
export default function App() {
  const { height, width } = Dimensions.get("window");
  const imagePosition = useSharedValue(1);
  const formButtonScale = useSharedValue(1);

  const [isRegistering, setIsRegistering] = useState(false);
  const imageAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [-height / 1.7, 0]);
    return {
      transform: [{ translateY: withTiming(interpolation, { duration: 1000 }) }],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [250, 0]);
    return {
      opacity: withTiming(imagePosition.value, { duration: 500 }),
      transform: [{ translateY: withTiming(interpolation, { duration: 1000 }) }],
    };
  });

  const closeButtonContainerStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [180, 360]);
    return {
      opacity: withTiming(imagePosition.value === 1 ? 0 : 1, { duration: 800 }),
      transform: [{ rotate: withTiming(interpolation + "deg", { duration: 1000 }) }],
    };
  });

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity:
        imagePosition.value === 0
          ? withDelay(400, withTiming(1, { duration: 1000 }))
          : withTiming(0, { duration: 300 }),
    };
  });

  const formButtonAnimatedStyle = () => {
    return {
      transform: [{ scale: formButtonAnimatedStyle.value }],
    };
  };

  const loginHandler = () => {
    imagePosition.value = 0;
    if (isRegistering) {
      runOnJS(setIsRegistering)(false);
    }
  };
  const registerHandler = () => {
    imagePosition.value = 0;
    if (!isRegistering) {
      runOnJS(setIsRegistering)(true);
    }
  };

  return (
    <Animated.View style={s.container}>
      <Animated.View style={[StyleSheet.absoluteFill, imageAnimatedStyle]}>
        <Svg height={height + 100} width={width}>
          <ClipPath id="clipPathId">
            <Ellipse cx={width / 2} rx={height} ry={height + 100} />
          </ClipPath>
          <Image
            preserveAspectRatio="xMidYMid slice"
            width={width + 100}
            height={height + 100}
            href={require("./assets/auth/registerBg.png")}
            clipPath="url(#clipPathId)"
          />
        </Svg>
        <Animated.View style={[s.closeButtonContainer, closeButtonContainerStyle]}>
          <Text
            onPress={() => {
              imagePosition.value = 1;
            }}
          >
            X
          </Text>
        </Animated.View>
      </Animated.View>

      <Animated.View style={s.buttonContainer}>
        <Animated.View style={buttonAnimatedStyle}>
          <Pressable onPress={loginHandler} style={s.button}>
            <Text style={s.buttonText}>LOG IN</Text>
          </Pressable>
        </Animated.View>
        <Animated.View style={buttonAnimatedStyle}>
          <Pressable onPress={registerHandler} style={s.button}>
            <Text style={s.buttonText}>REGISTER</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={[s.form, formAnimatedStyle]}>
          <TextInput style={s.textInput} placeholder="Email" placeholderTextColor="black" />
          {isRegistering && (
            <TextInput style={s.textInput} placeholder="Full Name" placeholderTextColor="black" />
          )}

          <TextInput style={s.textInput} placeholder="Password" placeholderTextColor="black" />
          <Animated.View style={[s.formButton, formButtonAnimatedStyle]}>
            <Pressable
              onPress={() => {
                formButtonScale.value = withSequence(withSpring(1.5), withSpring(1));
              }}
            >
              <Text style={s.formButtonText}>{isRegistering ? "REGISTER" : "LOG IN"}</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}
