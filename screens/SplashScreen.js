import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, useSharedValue, useAnimatedStyle, withDelay, withTiming } from "react-native-reanimated";

const SplashScreen = () => {
    const navigation = useNavigation();
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withDelay(
            1000,
            withTiming(1, {
                duration: 500,
                easing: Easing.inOut(Easing.ease),
            })
        );
    }, []);

    useEffect(() => {
        const getToken = async () => {
            const token = await AsyncStorage.getItem("caloriesgpt_username");
            setTimeout(async () => {
                if (token) {
                    const od = await AsyncStorage.getItem("OnboardingDone");
                    if (od && od === "true") {
                        navigation.replace("HomeScreen");
                    } else {
                        navigation.replace("OnboardingScreen");
                    }
                } else {
                    navigation.replace("LoginScreen");
                }
            }, 3000);
        }
        getToken();
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        "worklet";
        return {
            opacity: opacity.value,
        };
    });

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Animated.Image source={require('../assets/banana.png')} style={[{ height: 50, width: 50, alignSelf: 'center', tintColor: "white" }, animatedStyle]} />
                <Animated.Text style={[{ color: "#efeee9", fontFamily: "Lexend-Regular", fontSize: 40 }, animatedStyle]}>CaloriesGPT</Animated.Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#101010"
    },
});

export default SplashScreen;