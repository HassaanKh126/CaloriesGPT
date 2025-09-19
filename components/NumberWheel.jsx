import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "react-native-wheel-pick";

const NumberWheel = ({ start = 0, end = 100, suffix = "", onChange, selectedValue }) => {
    const numbers = Array.from({ length: end - start + 1 }, (_, i) => `${i + start}${suffix}`);
    const [value, setValue] = useState(numbers[0]);

    const handleChange = (val) => {
        setValue(val);
        if (onChange) onChange(val);
    };

    useEffect(() => {
        if (selectedValue) {
            setValue(selectedValue);
        }
    }, [selectedValue]);


    return (
        <View style={styles.container}>
            <Picker
                style={{ width: (suffix === ' ft' || suffix === ' in') ? 100 : 200, height: 250 }}
                selectedValue={value}
                pickerData={numbers}
                onValueChange={handleChange}
                selectTextColor='#000000'
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
});

export default NumberWheel;
