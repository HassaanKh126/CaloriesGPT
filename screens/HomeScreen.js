import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import LoaderOverlay from "../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const HomeScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [foods, setFoods] = useState([]);

    const height = useSharedValue(0);

    const toggleDropdown = () => {
        if (open) {
            height.value = withTiming(0, { duration: 300 });
        } else {
            height.value = withTiming(100, { duration: 300 });
        }
        setOpen(!open);
    };

    const animatedStyle = useAnimatedStyle(() => {
        "worklet";
        return {
            height: height.value,
            opacity: height.value === 0 ? 0 : 1,
        };
    });

    const openCamera = () => {
        launchCamera(
            {
                mediaType: "photo",
                cameraType: "back",
                saveToPhotos: true,
            },
            (response) => {
                if (response.didCancel) {
                    console.log("User cancelled camera");
                } else if (response.errorCode) {
                    console.log("Camera error: ", response.errorMessage);
                } else {
                    const uri = response.assets?.[0]?.uri;
                    processImage(uri)
                }
            }
        );
        toggleDropdown();
    };

    const openLibrary = () => {
        launchImageLibrary(
            {
                mediaType: "photo",
                selectionLimit: 1,
            },
            (response) => {
                if (response.didCancel) {
                    console.log("User cancelled library");
                } else if (response.errorCode) {
                    console.log("Library error: ", response.errorMessage);
                } else {
                    const uri = response.assets?.[0]?.uri;
                    processImage(uri)
                }
            }
        );
        toggleDropdown();
    };

    const processImage = async (uri) => {
        setLoading(true);
        try {
            const username = await AsyncStorage.getItem("caloriesgpt_username")
            const formData = new FormData();
            formData.append("username", username);
            formData.append("image", {
                uri: uri,
                type: "image/jpeg",
                name: "image.jpg",
            });

            const response = await fetch("http://localhost:1000/api/analyze-image", {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            setFoods(prev => [data.food_data, ...prev]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getFood = async () => {
        const username = await AsyncStorage.getItem("caloriesgpt_username");
        setLoading(true);
        try {
            const response = await fetch('http://localhost:1000/api/get-food', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username })
            });
            const data = await response.json();
            if (data.success === true) {
                setFoods(data.foods)
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: "An error occurred... Please try again."
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getFood();
    }, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <StatusBar hidden />
            <View style={styles.secondContainer}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Text style={{ fontFamily: 'Lexend-SemiBold', fontSize: 20 }}>CaloriesGPT</Text>
                    </View>
                    <View style={{ backgroundColor: "#101010", height: 30, width: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                        <Text style={{ color: "#efeee9", fontFamily: 'Lexend-SemiBold', textAlign: 'center' }}>D</Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ backgroundColor: "#ffffff", paddingHorizontal: 20, paddingVertical: 20, borderRadius: 15 }}>
                        <Text style={{ fontFamily: "Lexend-Medium", fontSize: 12, color: "#888888" }}>Calories Left:</Text>
                        <Text style={{ fontFamily: "Lexend-SemiBold", fontSize: 32, color: "#101010" }}>1000</Text>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: "#101010", padding: 10, borderRadius: 10, marginTop: 10, alignItems: "center" }} onPress={toggleDropdown} activeOpacity={0.6}>
                        <Text style={{ fontFamily: "Lexend-Medium", color: "#efeee9", fontSize: 16 }}>Add Food</Text>
                    </TouchableOpacity>
                    <Animated.View style={[styles.dropdown, animatedStyle]}>
                        <TouchableOpacity style={{ alignItems: 'center', padding: 10 }} onPress={openCamera}>
                            <Text style={{ fontFamily: "Lexend-Medium", color: "#efeee9", fontSize: 16 }}>Snap Food</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ alignItems: 'center', padding: 10 }} onPress={openLibrary}>
                            <Text style={{ fontFamily: "Lexend-Medium", color: "#efeee9", fontSize: 16 }}>Add Food from Library</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Text style={{ fontFamily: "Lexend-SemiBold", fontSize: 18, color: "#101010", marginVertical: 10 }}>Eaten Today</Text>
                    <ScrollView contentContainerStyle={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {foods.length > 0 ? foods.map((food, index) => {
                            return (
                                <Pressable key={index} style={{ backgroundColor: "#ffffff", borderRadius: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => { navigation.navigate("FoodScreen", { food }) }}>
                                    <View style={{ height: 110, width: 110, backgroundColor: "#7c7c7c", borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}>
                                        <Image source={{ uri: food.food_img_url }} style={{ height: "100%", width: "100%", backgroundColor: "#7c7c7c", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, objectFit: 'cover' }} />
                                    </View>
                                    <View style={{ padding: 10, flex: 1, justifyContent: 'center', maxHeight: 110 }}>
                                        <Text style={{ fontFamily: "Lexend-SemiBold", fontSize: 15, color: "#101010" }}>{food.food_name}</Text>
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
                    </ScrollView>
                </View>
            </View>
            {loading && <LoaderOverlay />}
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
    },
    dropdown: {
        width: "90%",
        backgroundColor: "#252525",
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        alignSelf: 'center',
        paddingTop: 5,
    },
});

export default HomeScreen;