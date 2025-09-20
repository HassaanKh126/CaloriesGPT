import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import Feather from "react-native-vector-icons/Feather";
import Heatmap from "../components/Heatmap";

const UserScreen = ({ route }) => {
    const { userData, foods } = route.params;

    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const getWeightGoal = () => {
        const cw = userData.info.weight.value.toFixed(2);
        const goal = userData.info.goal;
        let gw;

        if (goal === "Lose Weight") {
            gw = cw - 5;
        }
        if (goal === "Maintain") {
            gw = cw;
        }
        if (goal === "Gain Weight") {
            gw = cw + 5;
        }
        return gw;
    }

    const getStreak = () => {
        const daysWithLogs = [
            ...new Set(foods.map(f => new Date(f.createdAt).toDateString()))
        ].sort((a, b) => new Date(b) - new Date(a));
        let streak = 0;
        let current = new Date();

        while (true) {
            const dateStr = current.toDateString();
            if (daysWithLogs.includes(dateStr)) {
                streak++;
                current.setDate(current.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <View style={styles.secondContainer}>
                <View style={{ width: "100%", padding: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: "#101010", borderRadius: 15, marginBottom: 10, position: "relative", elevation: 3 }}>
                    <View style={{ position: "absolute", top: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '95%' }}>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Ionicons name="arrow-back" color={"#ffffff"} size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { navigation.navigate("SettingsScreen", { userData }) }} style={{ paddingRight: 2 }}>
                            <Feather name="settings" color={"#ffffff"} size={20} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontFamily: "Lexend-SemiBold", color: "#ffffff", fontSize: 28, padding: 60 }}>{userData.username}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: "row", gap: 10 }}>
                    <View style={{ backgroundColor: "#ffffff", flex: 1, padding: 15, borderRadius: 15, elevation: 3, alignItems: 'flex-start' }}>
                        <Text style={{ fontFamily: "Lexend-Medium", fontSize: 13, color: "#101010" }}>Today's Progress</Text>
                        <Text style={{ fontFamily: "Lexend-Medium", fontSize: 16, color: "#101010" }}><Text style={{ fontSize: 26 }}>{foods.filter(f => new Date(f.createdAt).toDateString() === new Date().toDateString()).reduce((sum, f) => sum + f.calories, 0)}</Text>/{userData.calories_goal}</Text>
                    </View>
                    <View style={{ backgroundColor: "#ffffff", flex: 1, padding: 15, borderRadius: 15, elevation: 3, alignItems: 'flex-start' }}>
                        <Text style={{ fontFamily: "Lexend-Medium", fontSize: 13, color: "#101010" }}>Meals Logged</Text>
                        <Text style={{ fontFamily: "Lexend-Medium", fontSize: 24, color: "#101010" }}>{foods.length}</Text>
                    </View>
                </View>
                <View style={{ display: 'flex', flexDirection: "row", marginTop: 10 }}>
                    <View style={{ backgroundColor: "#ffffff", flex: 1, padding: 15, borderRadius: 15, elevation: 3, alignItems: 'flex-start' }}>
                        <Text style={{ fontFamily: "Lexend-Medium", fontSize: 16 }}>Weight Progress</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                            <View style={{ flex: 1, padding: 10, backgroundColor: "#efeee9", elevation: 3, borderRadius: 10 }}>
                                <Text style={{ fontFamily: "Lexend-Medium", fontSize: 13, color: "#101010" }}>Current Weight</Text>
                                <Text style={{ fontFamily: "Lexend-Medium", fontSize: 24, color: "#101010" }}>{userData.info.weight.value.toFixed(2)} kg</Text>
                            </View>
                            <View style={{ flex: 1, padding: 10, backgroundColor: "#efeee9", elevation: 3, borderRadius: 10 }}>
                                <Text style={{ fontFamily: "Lexend-Medium", fontSize: 13, color: "#101010" }}>Goal</Text>
                                <Text style={{ fontFamily: "Lexend-Medium", fontSize: 24, color: "#101010" }}>{getWeightGoal()} kg</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ display: 'flex', flexDirection: "row", gap: 10, marginTop: 10 }}>
                    <View style={{ backgroundColor: "#ffffff", flex: 1, paddingVertical: 15, paddingHorizontal: 20, borderRadius: 15, elevation: 3, alignItems: 'flex-start' }}>
                        <Text style={{ fontFamily: "Lexend-Medium", fontSize: 18, color: "#101010" }}>Streak</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Fontisto name="fire" size={22} color={"#101010"} />
                            <Text style={{ fontFamily: "Lexend-Medium", fontSize: 26, color: "#101010" }}>{getStreak()}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Heatmap calorieGoal={userData.calories_goal} foods={foods} />
                </View>
                <View style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <TouchableOpacity style={{ padding: 20, borderRadius: 15, backgroundColor: "#101010", marginBottom: 10, alignItems: 'center', elevation: 3 }} activeOpacity={0.7} onPress={() => { navigation.navigate("FoodsScreen", { foods }) }}>
                        <Text style={{ fontFamily: "Lexend-Medium", color: "#ffffff" }}>View All Meal Logs</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#efeee9",
    },
    secondContainer: {
        flex: 1,
        width: "85%",
        alignSelf: 'center',
    }
});

export default UserScreen;