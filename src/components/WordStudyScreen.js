// src/components/WordStudyScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WordStudyScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>단어 학습</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6A0DAD",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    color: "#FFFFFF",
  },
});

export default WordStudyScreen;
