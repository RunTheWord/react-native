import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; // Firebase 설정 가져오기
import { v4 as uuidv4 } from "uuid"; // 고유 ID 생성 라이브러리 (uuid)
import { LinearGradient } from "expo-linear-gradient";

const saveWrongAnswersToDB = async (category, level, incorrectWords) => {
  try {
    const collectionRef = collection(db, `wrong_notes_${category}`);
    const data = {
      pid: uuidv4(), // 고유 ID 생성
      level: level,
      incorrectWords: incorrectWords.map((word) => ({
        id: uuidv4(), // 각 단어에 고유 ID 추가
        english: word.english,
        korean: word.korean,
      })),
      timestamp: new Date(), // 저장 시간 기록
    };
    await addDoc(collectionRef, data);
    console.log(`오답 단어가 저장되었습니다 (${category}):`, data);
  } catch (error) {
    console.error(`오답 저장 중 오류 발생 (${category}):`, error);
  }
};

const TestingResultScreen = ({ route }) => {
  const navigation = useNavigation();
  const { title, level, finalScore, total, incorrectWords } = route.params;

  return (
    <LinearGradient
      colors={["#5A20BB", "#7F9DFF"]} // 배경색 그라데이션
      style={styles.container}
    >
      {/* 헤더 영역 */}
      <Text style={styles.headerText}>시험 결과</Text>
      <Text style={styles.scoreText}>
        {finalScore}/{total}
      </Text>

      {/* 틀린 단어 리스트 */}
      <View style={styles.listContainer}>
        <FlatList
          data={incorrectWords}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.wordText}>{item.english}</Text>
              <Text style={styles.meaningText}>{item.korean}</Text>
            </View>
          )}
        />
      </View>

      {/* 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // 오답 저장 호출
            saveWrongAnswersToDB(title, level, incorrectWords);

            // 생성된 객체를 출력하거나 사용할 수 있음
            navigation.reset({
              index: 1,
              routes: [{ name: "Home" }, { name: "Home" }],
            });
          }}
        >
          <Text style={styles.buttonText}>오답노트에 저장하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            })
          }
        >
          <Text style={styles.buttonText}>메인으로 돌아가기</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  scoreText: {
    fontSize: 48,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginVertical: 20,
    alignSelf: "center",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  wordText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6A0DAD",
  },
  meaningText: {
    fontSize: 18,
    color: "#333333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#5B00A1",
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default TestingResultScreen;
