import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StatusBar, StyleSheet, Text, View } from "react-native";

const SplashScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const getToken = async () => {
            const token = await AsyncStorage.getItem("caloriesgpt_token");
            setTimeout(()=>{
                if (token) {
                    navigation.replace("HomeScreen");
                } else {
                    navigation.replace("LoginScreen");
                }
            }, 2500);
        }
        getToken();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Text style={{ color: "#efeee9", fontFamily: "Cardo-Regular", fontSize: 48 }}>CaloriesGPT</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#101010"
    }
});

export default SplashScreen;