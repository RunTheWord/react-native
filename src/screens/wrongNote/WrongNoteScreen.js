import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const WrongNoteScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([
    { id: "elementary_words", title: "초등 영단어", progress: "2/200" },
    { id: "sat_words", title: "수능 영단어", progress: "22/200" },
    { id: "toeic_words", title: "토익 영단어", progress: "42/200" },
    { id: "business_words", title: "비즈니스 영어", progress: "55/200" },
    { id: "travel_words", title: "여행 영어", progress: "3/200" },
    { id: "daily_words", title: "일상 생활 영어", progress: "5/200" },
    { id: "it_words", title: "IT 전문 영어", progress: "11/200" },
    { id: "legal_words", title: "법률 영어", progress: "10/200" },
    { id: "medical_words", title: "의학 영어", progress: "100/200" },
    { id: "science_words", title: "과학 영어", progress: "5/200" },
  ]);

  // Firestore에서 각 카테고리별 오답 데이터 가져오기
  const fetchWrongNotes = async () => {
    try {
      const updatedCategories = await Promise.all(
        categories.map(async (category) => {
          const querySnapshot = await getDocs(
            collection(db, `wrong_notes_${category.id}`)
          );
          const wordCount = querySnapshot.size; // 오답 개수
          return {
            ...category, // progress 동적 업데이트
          };
        })
      );
      setCategories(updatedCategories); // 상태 업데이트
    } catch (error) {
      console.error("오답 노트 데이터 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    fetchWrongNotes();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#5A20BB", "#7F9DFF"]}
        style={styles.gradientBackground}
      >
        <Text style={styles.header}>✍🏻121일 연속 학습 중 입니다!</Text>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("WrongNoteLevelScreen", {
                  category: item.id, // 카테고리 ID 전달
                  title: item.title,
                })
              }
            >
              <LinearGradient
                colors={["#DEFFEE", "#91FFFC"]}
                style={styles.cardGradientBackground}
              >
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.progress}>오답 수: {item.progress}</Text>
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
    height: 201,
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
  progress: { marginLeft: 218, marginTop: 55, fontSize: 19 },
});

export default WrongNoteScreen;
