import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const TestLevelScreen = ({ route }) => {
  const { title, collection: collectionName } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [wordChunks, setWordChunks] = useState([]);

  // 단어를 20개씩 나누는 함수
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  // Firebase에서 단어 가져오기
  const fetchWords = async () => {
    if (!collectionName) {
      console.error("컬렉션 이름이 비어 있습니다.");
      setLoading(false);
      return;
    }
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const words = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const actualChunks = chunkArray(words, 20);

      // 더미 챕터 데이터 생성
      const dummyChunks = Array.from({ length: 20 - actualChunks.length }, () =>
        Array(20).fill({ id: "dummy", word: "N/A" })
      );
      setWordChunks([...actualChunks, ...dummyChunks]);
    } catch (error) {
      console.error("단어 가져오기 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#5A20BB", "#7F9DFF"]} style={styles.container}>
      <FlatList
        data={wordChunks}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              if (index < 4) {
                navigation.navigate("TestingScreen", {
                  title: title,
                  level: `챕터 ${index + 1}`,
                  words: item,
                });
              } else {
                // 챕터 5~20 클릭 시 아무 동작하지 않음
                console.log(`챕터 ${index + 1}은 실제로 사용 불가`);
              }
            }}
          >
            <LinearGradient
              colors={["#FFFEE3", "#FFFD9E"]}
              style={styles.cardGradientBackground}
            >
              <Text style={styles.cardTitle}>{`챕터 ${index + 1}`}</Text>
              <Text style={styles.progress}>
                단어 개수: {item.length || "0"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6A0DAD",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6A0DAD",
  },
  card: {
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  cardGradientBackground: {
    padding: 15,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  progress: {
    fontSize: 14,
    color: "#333333",
  },
});

export default TestLevelScreen;
