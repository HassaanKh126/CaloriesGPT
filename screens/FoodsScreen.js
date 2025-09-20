import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const FoodsScreen = ({ route }) => {
    const { foods } = route.params;

    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const truncate = (str, maxLength) => {
        return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <View style={styles.secondContainer}>
                <View style={{ marginBottom: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Ionicons name="arrow-back" size={24} style={{ textShadowColor: "#000000", textShadowRadius: 1, marginTop: 4 }} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: "Lexend-SemiBold", fontSize: 24 }}>Logged Meals</Text>
                </View>
                <ScrollView contentContainerStyle={{ display: 'flex', flexDirection: 'column', gap: 10 }} showsVerticalScrollIndicator={false}>
                    {foods.length > 0 ? foods.map((food, index) => {
                        return (
                            <Pressable key={index} style={{ backgroundColor: "#ffffff", borderRadius: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => { navigation.navigate("FoodScreen", { food }) }}>
                                <View style={{ height: 110, width: 110, backgroundColor: "#7c7c7c", borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}>
                                    <Image source={{ uri: food.food_img_url }} style={{ height: "100%", width: "100%", backgroundColor: "#7c7c7c", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, objectFit: 'cover' }} />
                                </View>
                                <View style={{ padding: 10, flex: 1, justifyContent: 'center', maxHeight: 110 }}>
                                    <Text style={{ fontFamily: "Lexend-SemiBold", fontSize: 15, color: "#101010" }}>{truncate(food.food_name, 32)}</Text>
                                    <View style={{ marginVertical: 5 }}>
                                        <Text style={{ fontFamily: "Lexend-Regular", fontSize: 14, color: "#555555" }}>{food.calories} Cal • {food.carbs}g Carbs</Text>
                                        <Text style={{ fontFamily: "Lexend-Regular", fontSize: 14, color: "#555555" }}>{food.fats}g Fats • {food.protein}g Protein</Text>
                                    </View>
                                </View>
                            </Pressable>
                        )
                    }) : (
                        <View>
                            <Text style={{ textAlign: 'left', fontFamily: "Lexend-Regular", color: "#000000", fontSize: 16 }}>{`Nothing eaten yet... \nbut, you can change that.`}</Text>
                        </View>
                    )}
                    <View style={{ height: 20 }}></View>
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
        width: "85%",
        alignSelf: 'center'
    }
})

export default FoodsScreen;