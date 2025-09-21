import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Confetti from 'react-native-confetti';

const SuccessScreen = ({ navigation }) => {
    const confettiRef = useRef(null);

    useEffect(() => {
        if (confettiRef.current) {
            confettiRef.current.startConfetti();
        }
    }, []);

    return (
        <View style={styles.container}>
            <Confetti
                ref={confettiRef}
                confettiCount={100}
                duration={2000}
                timeout={30} />
            <View>
                <Text style={styles.screenTitle}>Subscribed Successfully!</Text>
                <TouchableOpacity style={styles.button} onPress={() => { navigation.goBack() }}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#efeee9"
    },
    screenTitle: {
        fontSize: 24,
        fontFamily: 'Lexend-Medium',
        color: '#101010',
    },
    button: {
        backgroundColor: '#101010',
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        color: '#efeee9',
        fontSize: 17,
        fontFamily: 'Lexend-Regular'
    },
});

export default SuccessScreen;