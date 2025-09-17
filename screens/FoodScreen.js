import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FoodScreen = ({ route }) => {
    const { food } = route.params;

    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <View style={styles.secondContainer}>
                <View style={{ alignSelf: 'center', backgroundColor: "#404040", width: '100%', borderRadius: 20, }}>
                    <Image source={{ uri: food.food_img_url }} style={{ width: "100%", height: 250, borderRadius: 20, objectFit: 'contain' }} />
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