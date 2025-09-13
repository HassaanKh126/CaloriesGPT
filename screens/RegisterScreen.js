import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { KeyboardAvoidingView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const RegisterScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    function isValidEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
        return regex.test(String(email).toLowerCase());
    }

    const handleRegister = async () => {
        if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
            console.log("All fields are required.");
            return;
        }
        if (!isValidEmail(email)) {
            console.log('invalid email');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch("http://192.168.18.85:1000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();
            if (data.error === "Email already exists.") {
                Toast.show({
                    type: 'error',
                    text1: "An account with this email already exists."
                });
            }
            if (data.error === "Username already exists.") {
                Toast.show({
                    type: 'error',
                    text1: "Username already exists."
                });
            }
            if (data.success === true) {
                Toast.show({
                    type: 'success',
                    text1: "User Registered Successfully."
                });
                navigation.goBack();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]} behavior="height">
            <StatusBar hidden />
            <View style={styles.secondContainer}>
                <Text style={{ fontFamily: "Cardo-Bold", fontSize: 36, color: "#101010" }}>CaloriesGPT</Text>
                <Text style={{ fontFamily: "Lexend-Medium", fontSize: 24, color: "#101010", marginBottom: 20 }}>Sign Up</Text>
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontFamily: "Lexend-Medium", fontSize: 14, marginLeft: 5, marginBottom: 5 }}>Username</Text>
                    <TextInput placeholder="Username" placeholderTextColor={"#888888"} style={{ padding: 10, borderWidth: 1.5, borderRadius: 10, borderColor: '#101010', color: "#101010", fontFamily: "Lexend-Regular", fontSize: 15 }} value={username} onChangeText={setUsername} />
                </View>
                <View>
                    <Text style={{ fontFamily: "Lexend-Medium", fontSize: 14, marginLeft: 5, marginBottom: 5 }}>Email</Text>
                    <TextInput placeholder="example@example.com" placeholderTextColor={"#888888"} style={{ padding: 10, borderWidth: 1.5, borderRadius: 10, borderColor: '#101010', color: "#101010", fontFamily: "Lexend-Regular", fontSize: 15 }} value={email} onChangeText={setEmail} />
                </View>
                <View style={{ marginVertical: 20 }}>
                    <Text style={{ fontFamily: "Lexend-Medium", fontSize: 14, marginLeft: 5, marginBottom: 5 }}>Password</Text>
                    <TextInput placeholder="Password" placeholderTextColor={"#888888"} secureTextEntry={true} style={{ padding: 10, borderWidth: 1.5, borderRadius: 10, borderColor: '#101010', color: "#101010", fontFamily: "Lexend-Regular", fontSize: 15 }} value={password} onChangeText={setPassword} />
                </View>
                <View>
                    <TouchableOpacity style={{ backgroundColor: loading ? "#555555" : "#101010", padding: 11, borderRadius: 10, alignItems: "center" }} onPress={handleRegister} disabled={loading} activeOpacity={0.7}>
                        <Text style={{ color: "#efeee9", fontFamily: "Lexend-Medium", fontSize: 16 }}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignItems: 'center', marginVertical: 10 }} onPress={() => { navigation.goBack() }}>
                        <Text style={{ fontFamily: 'Lexend-Regular', fontSize: 13 }}>Already have an account? Log in.</Text>
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

export default RegisterScreen;