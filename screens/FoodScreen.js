import React, { useEffect, useState } from "react";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { BURL } from "@env";

const FoodScreen = ({ route }) => {
    const { food } = route.params;

    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);

    const handleRemoveItem = async () => {
        if (food._id.trim() === "") {
            Toast.show({
                type: 'error',
                text1: "An error occurred."
            });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${BURL}/api/remove-food`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ food_id: food._id })
            });
            const data = await response.json();
            if (data.success === true) {
                Toast.show({
                    type: 'success',
                    text1: "Food removed successfully."
                });
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "HomeScreen" }],
                    })
                );
                return;
            }
            if (data.error) {
                Toast.show({
                    type: 'error',
                    text1: "An error occurred."
                });
                return;
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: "An error occurred."
            });
            return;
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <View style={styles.secondContainer}>
                <TouchableOpacity style={{ marginBottom: 10, elevation: 3 }} onPress={() => { navigation.goBack() }}>
                    <Ionicons name="arrow-back" size={28} color={"#000000"} style={{ textShadowColor: "#000000", textShadowRadius: 1 }} />
                </TouchableOpacity>
                <View style={{ alignSelf: 'center', backgroundColor: "#101010", width: '100%', borderRadius: 20, elevation: 3 }}>
                    <Image source={{ uri: food.food_img_url }} style={{ width: "100%", height: 250, borderRadius: 20, objectFit: 'contain' }} />
                </View>
                <View style={{ marginTop: 10, flex: 1 }}>
                    <Text style={{ fontFamily: "Lexend-SemiBold", fontSize: 20, marginBottom: 15 }}>{food.food_name}</Text>
                    <View style={{ paddingVertical: 12, paddingHorizontal: 16, width: '100%', alignItems: 'flex-start', alignSelf: 'flex-start', backgroundColor: "#ffffff", borderRadius: 10, elevation: 3 }}>
                        <Text style={{ fontFamily: "Lexend-Regular", fontSize: 20 }}>Calories</Text>
                        <Text style={{ fontFamily: "Lexend-SemiBold", fontSize: 24 }}>{food.calories} Cal</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, gap: 5 }}>
                        <View style={{ paddingVertical: 12, paddingHorizontal: 16, alignItems: 'flex-start', alignSelf: 'flex-start', backgroundColor: "#ffffff", borderRadius: 10, flex: 1, elevation: 3 }}>
                            <Text style={{ fontFamily: "Lexend-Regular", fontSize: 20 }}>Fats</Text>
                            <Text style={{ fontFamily: "Lexend-SemiBold", fontSize: 24 }}>{food.fats}g</Text>
                        </View>
                        <View style={{ paddingVertical: 12, paddingHorizontal: 16, alignItems: 'flex-start', alignSelf: 'flex-start', backgroundColor: "#ffffff", borderRadius: 10, flex: 1, elevation: 3 }}>
                            <Text style={{ fontFamily: "Lexend-Regular", fontSize: 20 }}>Carbs</Text>
                            <Text style={{ fontFamily: "Lexend-SemiBold", fontSize: 24 }}>{food.carbs}g</Text>
                        </View>
                        <View style={{ paddingVertical: 12, paddingHorizontal: 16, alignItems: 'flex-start', alignSelf: 'flex-start', backgroundColor: "#ffffff", borderRadius: 10, flex: 1, elevation: 3 }}>
                            <Text style={{ fontFamily: "Lexend-Regular", fontSize: 20 }}>Protein</Text>
                            <Text style={{ fontFamily: "Lexend-SemiBold", fontSize: 24 }}>{food.protein}g</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={{ fontFamily: "Lexend-SemiBold", fontSize: 20, marginTop: 15, marginBottom: 5 }}>Food Summary</Text>
                        <Text style={{ fontFamily: "Lexend-Regular", fontSize: 16 }}>{food.food_summary}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={{ backgroundColor: "#101010", padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10, opacity: loading ? 0.8 : 1 }} activeOpacity={0.8} onPress={handleRemoveItem}>
                            <Text style={{ fontFamily: "Lexend-Medium", fontSize: 15, color: "#ffffff" }}>Remove Food</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        width: "85%",
        alignSelf: 'center',
    }
});

export default FoodScreen;