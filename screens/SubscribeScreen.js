import React, { useEffect, useState } from 'react';
import RevenueCatUI from 'react-native-purchases-ui';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SubscribeScreen = ({ navigation }) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        navigation.goBack();
    };

    if (!isReady) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#36454f" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Ionicons name='close' color={"#efeee9"} size={30} />
            </TouchableOpacity>

            <RevenueCatUI.Paywall
                onPurchaseCompleted={() => {
                    navigation.replace("SuccessScreen");
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#efeee9',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
});

export default SubscribeScreen;