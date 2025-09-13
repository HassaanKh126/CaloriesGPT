import React from "react";
import { StyleSheet, Text, View } from "react-native";

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text>What is this</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: "#efeee9"
    }
});

export default HomeScreen;