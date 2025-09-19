import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons"
import Entypo from "react-native-vector-icons/Entypo"

const UserScreen = ({ route }) => {
    const { userData } = route.params;

    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    useEffect(() => {
        console.log(userData);
    }, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <View style={styles.secondContainer}>
                <View style={{ width: "100%", padding: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: "#101010", borderRadius: 15, marginBottom: 10, position: "relative", elevation: 3 }}>
                    <View style={{ position: "absolute", top: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '95%' }}>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Ionicons name="arrow-back" color={"#efeee9"} size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Entypo name="dots-three-vertical" color={"#efeee9"} size={20} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontFamily: "Lexend-SemiBold", color: "#ffffff", fontSize: 24, padding: 40 }}>{userData.username}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: "row", gap: 10 }}>
                    <View style={{ backgroundColor: "#ffffff", flex: 1, padding: 20, borderRadius: 15, elevation: 3 }}>
                        <Text>Today's Progress</Text>
                        <Text>1100/1810</Text>
                    </View>
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