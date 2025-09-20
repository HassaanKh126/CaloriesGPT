import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

const Heatmap = ({ foods, calorieGoal }) => {

  function getDateRange(days) {
    const dates = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  }

  const allDates = getDateRange(95);


  const groupedCalories = foods.reduce((acc, food) => {
    const date = new Date(food.createdAt).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + food.calories;
    return acc;
  }, {});

  const heatmapData = allDates.map(date => {
    const total = groupedCalories[date] || 0;

    let ratio;
    if (total <= calorieGoal) {
      ratio = total / calorieGoal;
    } else {
      const over = (total - calorieGoal) / calorieGoal;
      ratio = Math.max(0, 1 - over);
    }

    return { date, ratio: ratio === 0 ? 0.1 : ratio, data: `${total}/${calorieGoal}` };
  });

  return (
    <View style={{ backgroundColor: "#ffffff", padding: 10, borderRadius: 15, elevation: 3 }}>
      <Text style={{ fontFamily: "Lexend-Medium", fontSize: 16, textAlign: "left", marginBottom: 5, marginLeft: 5 }}>Calories Heatmap</Text>
      <View style={{ flexDirection: "row", justifyContent: 'center' }}>
        {Array.from({ length: Math.ceil(heatmapData.length / 7) }).map((_, weekIndex) => (
          <View key={weekIndex} style={{ flexDirection: "column" }}>
            {heatmapData.slice(weekIndex * 7, weekIndex * 7 + 7).map(day => (
              <Pressable
                onPress={() => {
                  Toast.show({
                    type: "info",
                    text1: `${day.data} Calories`
                  });
                }}
                key={day.date}
                style={{
                  width: 17,
                  height: 17,
                  margin: 2.5,
                  backgroundColor: `rgba(0,0,0,${day.ratio})`,
                  borderRadius: 3,
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  )
}

export default Heatmap;