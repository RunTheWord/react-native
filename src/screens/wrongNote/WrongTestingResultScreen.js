import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const WrongTestingResultScreen = ({ route, navigation }) => {
  const { title, level, finalScore, total, incorrectWords } = route.params;
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!incorrectWords || incorrectWords.length === 0) {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true,
      }).start();
    }
  }, [incorrectWords]);

  return (
    <LinearGradient colors={["#5A20BB", "#7F9DFF"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title + "    "} 오답 테스트 결과</Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>
          점수: {finalScore} / {total}
        </Text>
      </View>

      {incorrectWords && incorrectWords.length > 0 ? (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>틀린 단어</Text>
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
      ) : (
        <View style={styles.celebrationContainer}>
          {/* GIF 표시 */}
          <Animated.View
            style={[
              styles.animatedView,
              { transform: [{ scale: scaleValue }] },
            ]}
          >
            <Image
              source={require("../../../assets/cc.gif")} // GIF 파일 경로
              style={styles.celebrationGif}
            />
          </Animated.View>
          <Text style={styles.noErrorsText}>
            축하합니다! 틀린 단어가 없습니다.
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "WrongNoteScreen" }],
            })
          }
        >
          <Text style={styles.buttonText}>오답 노트로 돌아가기</Text>
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
          <Text style={styles.buttonText}>메인 화면으로 돌아가기</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    color: "#FFFFFF", // 흰색 글씨
    fontWeight: "bold",
  },
  scoreContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  scoreText: {
    fontSize: 30,
    color: "#FFFFFF", // 흰색 글씨
    fontWeight: "bold",
  },
  listContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // 반투명 흰색 배경
    borderRadius: 10,
    marginHorizontal: 20,
    padding: 10,
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black", // 흰색 글씨
    marginBottom: 10,
    textAlign: "center",
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
    color: "#333333",
  },
  meaningText: {
    fontSize: 18,
    color: "#333333",
  },
  celebrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animatedView: {
    marginBottom: 20,
  },
  celebrationGif: {
    width: 200, // GIF 너비
    height: 200, // GIF 높이
    marginLeft: 40,
    marginBottom: 40,
  },
  noErrorsText: {
    textAlign: "center",
    fontSize: 18,
    marginVertical: 20,
    color: "#FFFFFF", // 흰색 글씨
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "black", // 버튼 반투명 배경
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#FFFFFF", // 흰색 글씨
    fontWeight: "bold",
  },
});

export default WrongTestingResultScreen;
