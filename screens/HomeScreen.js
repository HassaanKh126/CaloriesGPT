import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import LoaderOverlay from "../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { BURL } from "@env";
import Purchases from "react-native-purchases";

const HomeScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [foods, setFoods] = useState([]);
    const [userData, setUserData] = useState();
    const height = useSharedValue(0);
    const [subscriptionStatus, setSubscriptionStatus] = useState("FREE");

    useEffect(() => {
        getSubscriptionStatus()
    }, []);

    const getSubscriptionStatus = async () => {
        const customerinfo = await Purchases.getCustomerInfo();
        if (customerinfo.entitlements.active.pro?.isActive) {
            setSubscriptionStatus("PRO");
        } else {
            setSubscriptionStatus("FREE");
        }

    }

    const toggleDropdown = () => {
        if (subscriptionStatus === "FREE") {
            if (foods.length < 3) {
                if (open) {
                    height.value = withTiming(0, { duration: 300 });
                } else {
                    height.value = withTiming(100, { duration: 300 });
                }
                setOpen(!open);
            } else {
                Toast.show({
                    type: 'info',
                    text1: `Your free trial has ended.\nSubscribe to get unlimited meal logs.`
                });
                navigation.navigate("SubscribeScreen");
            }
        }
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
                maxWidth: 1024,
                maxHeight: 1024,
                quality: 0.7,
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
                maxWidth: 1024,
                maxHeight: 1024,
                quality: 0.7,
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
            const username = await AsyncStorage.getItem("caloriesgpt_username");

            const formData = new FormData();
            formData.append("username", username);
            formData.append("image", {
                uri: uri,
                type: "image/jpeg",
                name: `image_${Date.now()}.jpg`,
            });

            const response = await fetch(`${BURL}/api/analyze-image`, {
                method: "POST",
                headers: { "Content-Type": "multipart/form-data" },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const result = await response.json();

            if (result.message === "Food analysis started, check back later.") {
                const pollInterval = 2000;
                const maxAttempts = 15;
                let attempts = 0;

                const pollForFood = async () => {
                    attempts++;
                    const res = await fetch(`${BURL}/api/get-food`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username }),
                    });
                    const data = await res.json();

                    if (data.success && data.foods.length === foods.length + 1) {
                        const latestFood = data.foods[0];

                        if (latestFood.food_img_url.includes("image")) {
                            setFoods(prev => [latestFood, ...prev]);
                            setLoading(false);
                            return;
                        }
                    }

                    if (attempts < maxAttempts) {
                        setTimeout(pollForFood, pollInterval);
                    } else {
                        console.warn("Food analysis timed out");
                        setLoading(false);
                    }
                };

                pollForFood();
            } else {
                console.error("Upload failed or backend rejected request:", result);
                setLoading(false);
            }

        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const getFood = async () => {
        const username = await AsyncStorage.getItem("caloriesgpt_username");
        setLoading(true);
        try {
            const response = await fetch(`${BURL}/api/get-food`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username })
            });
            const data = await response.json();
            if (data.success === true) {
                setUserData(data.user)
                setFoods(data.foods)
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: "An error occurred. Please try again."
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getFood();
    }, []);

    const truncate = (str, maxLength) => {
        return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
            <StatusBar hidden />
            <View style={styles.secondContainer}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Text style={{ fontFamily: 'Lexend-SemiBold', fontSize: 20 }}>CaloriesGPT</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: 'center', gap: 5 }}>
                        {subscriptionStatus === "FREE" && (
                            <Pressable style={{ display: 'flex', flexDirection: "row", alignItems: 'center', gap: 5, backgroundColor: "#101010", padding: 7, borderRadius: 10 }} onPress={() => { navigation.navigate("SubscribeScreen") }}>
                                <Text style={{ fontFamily: "Lexend-Regular", color: "#efeee9", fontSize: 12 }}>SUBSCRIBE</Text>
                                <FontAwesome6 name="crown" size={15} color={"#efeee9"} />
                            </Pressable>
                        )}
                        {userData && (
                            <Pressable style={{ backgroundColor: "#101010", height: 30, width: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }} onPress={() => { navigation.navigate("UserScreen", { userData: userData, foods: foods }) }}>
                                <Text style={{ color: "#efeee9", fontFamily: 'Lexend-SemiBold', textAlign: 'center' }}>{userData && userData.username[0].toUpperCase()}</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ backgroundColor: "#ffffff", paddingHorizontal: 20, paddingVertical: 20, borderRadius: 15 }}>
                        <Text style={{ fontFamily: "Lexend-Medium", fontSize: 12, color: "#888888" }}>Calories Progress:</Text>
                        <Text style={{ fontFamily: "Lexend-Medium", fontSize: 18, color: "#101010" }}><Text style={{ fontFamily: "Lexend-Medium", fontSize: 32 }}>{foods.filter(f => new Date(f.createdAt).toDateString() === new Date().toDateString()).reduce((sum, f) => sum + f.calories, 0)}</Text>/{userData ? userData.calories_goal : 0}</Text>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: "#101010", padding: 10, borderRadius: 10, marginTop: 10, alignItems: "center" }} onPress={toggleDropdown} activeOpacity={0.8}>
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
                    <ScrollView contentContainerStyle={{ display: 'flex', flexDirection: 'column', gap: 10 }} showsVerticalScrollIndicator={false}>
                        {foods.filter(f => new Date(f.createdAt).toDateString() === new Date().toDateString()).length > 0 ? foods.filter(f => new Date(f.createdAt).toDateString() === new Date().toDateString()).map((food, index) => {
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
                        <View style={{ height: 10 }}></View>
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