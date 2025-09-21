import React, { useState } from "react";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BURL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Purchases from "react-native-purchases";

const SettingsScreen = ({ route }) => {
    const { userData } = route.params;

    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [username, setUsername] = useState(userData.username);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);

    const editUsername = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BURL}/api/edit-username`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: userData.username, newUsername: username })
            });
            const data = await response.json();
            if (data.message === "Username Taken.") {
                Toast.show({
                    type: 'error',
                    text1: "Username already taken."
                });
                return;
            }

            if (data.success === true) {
                await AsyncStorage.setItem("caloriesgpt_username", username);
                Toast.show({
                    type: 'success',
                    text1: "Username changed successfully."
                });
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "HomeScreen" }],
                    })
                );
            }
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: "An error occurred, Please try again."
            });
        } finally {
            setLoading(false);
        }
    }

    const deleteAllLogs = async () => {
        setLoading1(true);
        try {
            const response = await fetch(`${BURL}/api/delete-all-meal-logs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: userData.username })
            });
            const data = await response.json();
            if (data.error === "All fields are required.") {
                Toast.show({
                    type: 'error',
                    text1: "An error occurred, Please try again."
                });
                return;
            }

            if (data.success === true) {
                Toast.show({
                    type: 'success',
                    text1: "All logs deleted successfully."
                });
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "HomeScreen" }],
                    })
                );
            }
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: "An error occurred, Please try again."
            });
        } finally {
            setLoading1(false);
        }
    }

    const handleLogout = async () => {
        await AsyncStorage.removeItem("caloriesgpt_username");
        await AsyncStorage.removeItem("OnboardingDone");
        Purchases.logOut()
        setTimeout(() => {
            Toast.show({
                type: "success",
                text1: "Logged Out Successfully."
            });
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "LoginScreen" }],
                })
            );
        }, 2000);
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <View style={styles.secondContainer}>
                <View style={{ display: 'flex', flexDirection: "row", alignItems: 'center', gap: 5, marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Ionicons name="arrow-back" size={24} style={{ marginTop: 2, textShadowColor: "#000000", textShadowRadius: 1 }} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: "Lexend-Medium", fontSize: 24 }}>Settings</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ padding: 20, borderRadius: 15, backgroundColor: "#ffffff", elevation: 3 }}>
                        <Text style={{ fontFamily: "Lexend-Regular", marginBottom: 5 }}>Edit Username</Text>
                        <TextInput placeholder="Username" value={username} style={{ padding: 10, borderRadius: 10, borderWidth: 1.5, backgroundColor: "#ffffff", fontFamily: "Lexend-Regular", color: "#000000" }} onChangeText={setUsername} />
                        <TouchableOpacity style={{ marginTop: 5, backgroundColor: "#101010", padding: 10, borderRadius: 10, alignItems: 'center', opacity: loading ? 0.7 : 1 }} activeOpacity={0.7} onPress={editUsername} disabled={loading}>
                            <Text style={{ fontFamily: "Lexend-Medium", fontSize: 14, color: "#ffffff" }}>Edit Username</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ padding: 20, borderRadius: 15, backgroundColor: "#ffffff", marginTop: 10, elevation: 3 }}>
                        <Text style={{ fontFamily: "Lexend-SemiBold", fontSize: 20, marginBottom: 5 }}>User Info</Text>
                        <View style={{ padding: 10, borderRadius: 10, backgroundColor: "#efeee9", marginVertical: 5 }}>
                            <Text style={{ fontFamily: "Lexend-Medium", fontSize: 15 }}>Gender:  <Text style={{ fontSize: 18 }}>{userData.info.gender}</Text></Text>
                        </View>
                        <View style={{ padding: 10, borderRadius: 10, backgroundColor: "#efeee9", marginVertical: 5 }}>
                            <Text style={{ fontFamily: "Lexend-Medium", fontSize: 15 }}>Age:  <Text style={{ fontSize: 18 }}>{userData.info.age}</Text></Text>
                        </View>
                        <View style={{ padding: 10, borderRadius: 10, backgroundColor: "#efeee9", marginVertical: 5 }}>
                            <Text style={{ fontFamily: "Lexend-Medium", fontSize: 15 }}>Weight:  <Text style={{ fontSize: 18 }}>{userData.info.weight.value.toFixed(2)} kg</Text></Text>
                        </View>
                        <View style={{ padding: 10, borderRadius: 10, backgroundColor: "#efeee9", marginVertical: 5 }}>
                            <Text style={{ fontFamily: "Lexend-Medium", fontSize: 15 }}>Height:  <Text style={{ fontSize: 18 }}>{userData.info.height.value.toFixed(2)} cm</Text></Text>
                        </View>
                        <View style={{ padding: 10, borderRadius: 10, backgroundColor: "#efeee9", marginVertical: 5 }}>
                            <Text style={{ fontFamily: "Lexend-Medium", fontSize: 15 }}>Activity:  <Text style={{ fontSize: 18 }}>{userData.info.activity}</Text></Text>
                        </View>
                        <View style={{ padding: 10, borderRadius: 10, backgroundColor: "#efeee9", marginVertical: 5 }}>
                            <Text style={{ fontFamily: "Lexend-Medium", fontSize: 15 }}>Goal:  <Text style={{ fontSize: 18 }}>{userData.info.goal}</Text></Text>
                        </View>
                        <TouchableOpacity style={{ marginTop: 5, backgroundColor: "#101010", padding: 10, borderRadius: 10, alignItems: 'center' }} activeOpacity={0.7} onPress={() => {
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: "OnboardingScreen" }],
                                })
                            );
                        }}>
                            <Text style={{ fontFamily: "Lexend-Medium", fontSize: 14, color: "#ffffff" }}>Edit Info</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ marginTop: 5, backgroundColor: "#101010", padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 20, opacity: loading1 ? 0.7 : 1 }} activeOpacity={0.7} onPress={deleteAllLogs} disabled={loading1}>
                        <Text style={{ fontFamily: "Lexend-Medium", fontSize: 14, color: "#ffffff" }}>Delete All Meal Logs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 5, backgroundColor: "#101010", padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 10 }} activeOpacity={0.7} onPress={handleLogout}>
                        <Text style={{ fontFamily: "Lexend-Medium", fontSize: 14, color: "#ffffff" }}>Logout</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
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
    }
});

export default SettingsScreen;