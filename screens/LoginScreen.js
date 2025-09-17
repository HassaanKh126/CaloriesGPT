import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { KeyboardAvoidingView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { BURL } from "@env";

const LoginScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    function isValidEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
        return regex.test(String(email).toLowerCase());
    }

    const handleLogin = async () => {
        if (email.trim() === "" || password.trim() === "") {
            Toast.show({
                type: 'error',
                text1: 'All fields are required.'
            });
            return;
        }
        if (!isValidEmail(email)) {
            Toast.show({
                type: 'error',
                text1: 'Email invalid.'
            });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${BURL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.error === "User not found.") {
                Toast.show({
                    type: 'error',
                    text1: "User not found."
                });
                return;
            }
            if (data.error === "Invalid Password.") {
                Toast.show({
                    type: 'error',
                    text1: "Invalid Credentials."
                });
                return;
            }
            if (data.success === true) {
                await AsyncStorage.setItem("caloriesgpt_username", data.username);
                Toast.show({
                    type: 'success',
                    text1: "Login Successful."
                });
                navigation.replace("HomeScreen");
                return;
            }
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'An error occurred, Try again.'
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]} behavior="height">
            <StatusBar hidden />
            <View style={styles.secondContainer}>
                <Text style={{ fontFamily: "Lexend-Medium", fontSize: 36, color: "#101010" }}>CaloriesGPT</Text>
                <Text style={{ fontFamily: "Lexend-Regular", fontSize: 24, color: "#101010", marginBottom: 20 }}>Login</Text>
                <View>
                    <Text style={{ fontFamily: "Lexend-Regular", fontSize: 14, marginLeft: 5, marginBottom: 2 }}>Email</Text>
                    <TextInput placeholder="example@example.com" placeholderTextColor={"#888888"} style={{ padding: 10, borderWidth: 1.5, borderRadius: 10, borderColor: '#101010', color: "#101010", fontFamily: "Lexend-Regular", fontSize: 15 }} value={email} onChangeText={setEmail} />
                </View>
                <View style={{ marginVertical: 15 }}>
                    <Text style={{ fontFamily: "Lexend-Regular", fontSize: 14, marginLeft: 5, marginBottom: 2 }}>Password</Text>
                    <TextInput placeholder="Password" placeholderTextColor={"#888888"} secureTextEntry={true} style={{ padding: 10, borderWidth: 1.5, borderRadius: 10, borderColor: '#101010', color: "#101010", fontFamily: "Lexend-Regular", fontSize: 15 }} value={password} onChangeText={setPassword} />
                </View>
                <View>
                    <TouchableOpacity style={{ backgroundColor: "#101010", padding: 11, borderRadius: 10, alignItems: "center", opacity: loading ? 0.8 : 1 }} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
                        <Text style={{ color: "#efeee9", fontFamily: "Lexend-Medium", fontSize: 16 }}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignItems: 'center', marginVertical: 10 }} onPress={() => { navigation.navigate("RegisterScreen") }}>
                        <Text style={{ fontFamily: 'Lexend-Regular', fontSize: 13 }}>Don't have an account? Sign up.</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeee9"
    },
    secondContainer: {
        flex: 1,
        width: '85%',
        alignSelf: 'center',
        justifyContent: 'center'
    }
});

export default LoginScreen;