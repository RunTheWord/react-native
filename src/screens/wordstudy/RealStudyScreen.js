import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

export default function RealStudyScreen({ route, navigation }) {
  const { title, collection: collectionName } = route.params;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiddenState, setHiddenState] = useState({});
  const [hideEnglish, setHideEnglish] = useState(false);
  const [hideKorean, setHideKorean] = useState(true);

  const fetchWordsFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const words = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(words);

      const initialHiddenState = words.reduce((acc, item) => {
        acc[item.id] = { english: false, korean: true };
        return acc;
      }, {});
      setHiddenState(initialHiddenState);
    } catch (error) {
      console.error("Firestore 데이터 가져오기 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWordsFromFirestore();
  }, []);

  const toggleVisibility = (id, type) => {
    setHiddenState((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [type]: !prevState[id][type],
      },
    }));
  };

  const toggleAllVisibility = (type) => {
    setHiddenState((prevState) =>
      Object.keys(prevState).reduce((acc, id) => {
        acc[id] = {
          ...prevState[id],
          [type]: !prevState[id][type],
        };
        return acc;
      }, {})
    );

    // 버튼 상태 업데이트
    if (type === "english") {
      setHideEnglish((prev) => !prev);
    } else if (type === "korean") {
      setHideKorean((prev) => !prev);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.wordRow}>
      {/* 영어 */}
      <TouchableOpacity
        style={styles.wordBox}
        onPress={() => toggleVisibility(item.id, "english")}
      >
        <Text style={styles.wordText}>
          {hiddenState[item.id]?.english ? "👆" : item.english}
        </Text>
      </TouchableOpacity>

      {/* 한글 */}
      <TouchableOpacity
        style={styles.wordBox}
        onPress={() => toggleVisibility(item.id, "korean")}
      >
        <Text style={styles.wordText}>
          {hiddenState[item.id]?.korean ? "👆" : item.korean}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={["#6A0DAD", "#C299F6"]} style={styles.container}>
      <Text style={styles.headerText}>{title}</Text>

      {/* 전체 보이기/숨기기 버튼 */}
      <View style={styles.toggleButtons}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => toggleAllVisibility("english")}
        >
          <Text style={styles.toggleButtonText}>
            {hideEnglish ? "영어 보이기" : "영어 숨기기"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => toggleAllVisibility("korean")}
        >
          <Text style={styles.toggleButtonText}>
            {hideKorean ? "뜻 보이기" : "뜻 숨기기"}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFFFFF" />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>학습 종료</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  toggleButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  toggleButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6A0DAD",
  },
  listContainer: {
    paddingBottom: 20,
  },
  wordRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  wordBox: {
    flex: 1,
    backgroundColor: "#000",
    marginHorizontal: 5,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  wordText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6A0DAD",
  },
});
