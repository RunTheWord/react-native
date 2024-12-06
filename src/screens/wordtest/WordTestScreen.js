// src/components/WordTestScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const categories = [
  {
    id: "1",
    title: "초등 영단어",
    collection: "elementary_words",
    progress: 12,
    total: 50,
  },
  {
    id: "2",
    title: "수능 영단어",
    collection: "sat_words",
    progress: 37,
    total: 50,
  },
  {
    id: "3",
    title: "토익 영단어",
    collection: "toeic_words",
    progress: 0,
    total: 50,
  },
  {
    id: "4",
    title: "비즈니스 영어",
    collection: "business_words",
    progress: 15,
    total: 50,
  },
  {
    id: "5",
    title: "여행 영어",
    collection: "travel_words",
    progress: 22,
    total: 50,
  },
  {
    id: "6",
    title: "일상 생활 영어",
    collection: "daily_words",
    progress: 7,
    total: 50,
  },
  {
    id: "7",
    title: "IT 전문 영어",
    collection: "it_words",
    progress: 20,
    total: 50,
  },
  {
    id: "8",
    title: "법률 영어",
    collection: "legal_words",
    progress: 3,
    total: 50,
  },
  {
    id: "9",
    title: "의학 영어",
    collection: "medical_words",
    progress: 10,
    total: 50,
  },
  {
    id: "10",
    title: "과학 영어",
    collection: "science_words",
    progress: 25,
    total: 50,
  },
];

const WordTestScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#5A20BB", "#7F9DFF"]}>
        <Text style={styles.header}>✍🏻121일 연속 학습 중 입니다!</Text>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("TestLevelScreen", {
                  title: item.title,
                  collection: item.collection, // Firestore 컬렉션 이름 전달
                })
              }
            >
              <LinearGradient
                colors={["#FFFEE3", "#FFFD9E"]}
                style={styles.cardGradientBackground}
              >
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.progress}>학습률: {item.progress}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0 },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FFFFFF",
    marginTop: 30,
    marginBottom: 2,
    marginLeft: 20,
  },
  card: {
    padding: 10,
    borderRadius: 15,
    marginVertical: 10,
    height: 180,
  },
  cardGradientBackground: {
    flex: 1,
    padding: 20,
    borderRadius: 15,
  },
  cardTitle: {
    fontSize: 31,
    marginLeft: 10,
    marginTop: 10,
    fontWeight: "bold",
  },
  progress: { marginLeft: 265, marginTop: 50, fontSize: 20 },
});

export default WordTestScreen;
