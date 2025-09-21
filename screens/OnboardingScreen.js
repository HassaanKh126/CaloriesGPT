import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";
import Animated, { FadeInRight, FadeOutLeft, FadeIn, FadeOut, useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from "react-native-reanimated";
import NumberWheel from "../components/NumberWheel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BURL } from "@env";

const steps = [
  { key: "gender", question: "What is your gender?", options: ["Male", "Female", "Prefer not to say"] },
  { key: "age", question: "How old are you?", range: { start: 10, end: 100, suffix: " yrs" } },
  { key: "weight", question: "What is your weight?" },
  { key: "height", question: "What is your height?" },
  { key: "activity", question: "How active are you?", options: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"] },
  { key: "goal", question: "What is your goal?", options: ["Lose Weight", "Maintain", "Gain Weight"] },
];

const OnboardingScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const [weightUnit, setWeightUnit] = useState("kg");
  const [heightUnit, setHeightUnit] = useState("cm");

  const current = steps[step];

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        const username = await AsyncStorage.getItem("caloriesgpt_username");
        const response = await fetch(`${BURL}/api/onboarding`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, answers })
        });
        const data = await response.json();
        if (data.success === true) {
          await AsyncStorage.setItem("OnboardingDone", "true");
          navigation.replace("HomeScreen");
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
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSelect = (value) => {
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
  };

  const buttonOpacity = useSharedValue(answers[current.key] ? 1 : 0.4);

  useEffect(() => {
    buttonOpacity.value = withTiming(answers[current.key] ? 1 : 0.4, { duration: 300 });
  }, [answers[current.key]]);

  const animatedBgStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View style={[styles.rectangle, animatedStyle]} />
        <Text style={styles.loadingText}>Customizing your experience…</Text>
      </View>
    );
  }

  const renderWeight = () => (
    <View style={{ alignItems: "center" }}>
      <View style={styles.toggleRow}>
        {["kg", "lb"].map((unit) => (
          <TouchableOpacity
            key={unit}
            style={[styles.toggleButton, weightUnit === unit && styles.toggleSelected]}
            onPress={() => {
              setWeightUnit(unit);
              setAnswers((prev) => ({ ...prev, weight: null }));
            }}
          >
            <Text style={[styles.toggleText, weightUnit === unit && styles.toggleTextSelected]}>
              {unit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <NumberWheel
        start={weightUnit === "kg" ? 30 : 66}
        end={weightUnit === "kg" ? 200 : 440}
        suffix={` ${weightUnit}`}
        onChange={(val) => handleSelect({ value: val, unit: weightUnit })}
        selectedValue={answers.weight?.value}
      />
    </View>
  );

  const renderHeight = () => (
    <View style={{ alignItems: "center" }}>
      <View style={styles.toggleRow}>
        {["cm", "ft"].map((unit) => (
          <TouchableOpacity
            key={unit}
            style={[styles.toggleButton, heightUnit === unit && styles.toggleSelected]}
            onPress={() => {
              setHeightUnit(unit);
              setAnswers((prev) => ({ ...prev, height: null }));
            }}
          >
            <Text style={[styles.toggleText, heightUnit === unit && styles.toggleTextSelected]}>
              {unit === "cm" ? "cm" : "ft+in"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {heightUnit === "cm" ? (
        <NumberWheel
          start={120}
          end={220}
          suffix=" cm"
          onChange={(val) => handleSelect({ value: val, unit: "cm" })}
          selectedValue={answers.height?.value}
        />
      ) : (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <NumberWheel
            start={3}
            end={10}
            suffix=" ft"
            onChange={(ft) =>
              handleSelect({ feet: ft, inches: answers.height?.inches || 0, unit: "ft" })
            }
            selectedValue={answers.height?.feet}
          />
          <NumberWheel
            start={0}
            end={11}
            suffix=" in"
            onChange={(inch) =>
              handleSelect({ feet: answers.height?.feet || 5, inches: inch, unit: "ft" })
            }
            selectedValue={answers.height?.inches}
          />
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom }]}>
      <StatusBar hidden />
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((step + 1) / steps.length) * 100}%` },
          ]}
        />
      </View>

      <Text style={styles.stepIndicator}>{`${step + 1}/${steps.length}`}</Text>

      <Animated.View
        key={current.key}
        entering={FadeInRight}
        exiting={FadeOutLeft}
        style={styles.questionContainer}
      >
        <Text style={styles.question}>{current.question}</Text>

        {current.key === "weight"
          ? renderWeight()
          : current.key === "height"
            ? renderHeight()
            : current.options
              ? (
                <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.optionContainer}>
                  {current.options.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      activeOpacity={0.6}
                      style={[
                        styles.optionButton,
                        answers[current.key] === opt && styles.optionButtonSelected,
                      ]}
                      onPress={() => handleSelect(opt)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          answers[current.key] === opt && styles.optionTextSelected,
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              )
              : (
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                  <NumberWheel
                    start={current.range.start}
                    end={current.range.end}
                    suffix={current.range.suffix}
                    onChange={handleSelect}
                    selectedValue={answers[current.key]}
                  />
                </Animated.View>
              )}
      </Animated.View>

      <View style={styles.buttonRow}>
        {step > 0 && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={handleBack}
              style={[styles.button, styles.backButton]}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <TouchableOpacity
          onPress={handleNext}
          disabled={!answers[current.key]}
          style={[styles.button, { flex: 1, overflow: "hidden" }]}
          activeOpacity={0.7}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: 30, backgroundColor: "#101010" },
              animatedBgStyle,
            ]}
          />
          <Text style={styles.buttonText}>
            {step === steps.length - 1 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#efeee9", paddingHorizontal: 20, paddingTop: 50 },
  progressBar: { height: 6, backgroundColor: "#ddd", borderRadius: 3, overflow: "hidden", marginBottom: 20 },
  progressFill: { height: "100%", backgroundColor: "#101010" },
  stepIndicator: { textAlign: "center", fontSize: 14, color: "#666", fontFamily: "Lexend-Medium", marginBottom: 10 },
  questionContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  question: { fontSize: 22, fontFamily: "Lexend-SemiBold", textAlign: "center", color: "#101010", marginBottom: 30 },
  optionContainer: { width: "100%", alignItems: "center" },
  optionButton: { paddingVertical: 14, paddingHorizontal: 20, backgroundColor: "#fff", borderRadius: 12, marginBottom: 12, width: "90%", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5 },
  optionButtonSelected: { backgroundColor: "#101010" },
  optionText: { fontSize: 16, color: "#101010", fontFamily: "Lexend-Medium" },
  optionTextSelected: { color: "#efeee9", fontFamily: "Lexend-Medium" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 40 },
  button: { flex: 1, marginHorizontal: 5, paddingVertical: 14, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  backButton: { backgroundColor: "#101010" },
  buttonText: { color: "#efeee9", fontSize: 16, fontFamily: "Lexend-Medium" },
  toggleRow: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  toggleButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: "#fff", marginHorizontal: 6 },
  toggleSelected: { backgroundColor: "#101010" },
  toggleText: { fontSize: 14, color: "#101010", fontFamily: "Lexend-Medium" },
  toggleTextSelected: { color: "#efeee9" },
  loadingContainer: { flex: 1, backgroundColor: "#efeee9", justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 20, fontSize: 18, color: "#101010", fontFamily: "Lexend-Medium" },
});

export default OnboardingScreen;