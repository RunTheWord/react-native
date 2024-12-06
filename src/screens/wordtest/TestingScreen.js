import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const TestingScreen = ({ route }) => {
  const navigation = useNavigation();
  const { title, level, words } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [score, setScore] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState([]);
  const [randomOptions, setRandomOptions] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeoutMessage, setTimeoutMessage] = useState(false);

  const wordsData = [...words];

  useEffect(() => {
    const shuffled = [...wordsData].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setCurrentWord(shuffled[0]);
    generateRandomOptions(shuffled[0]);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      handleTimeout();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 300);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const generateRandomOptions = (word) => {
    const options = [word.korean];
    while (options.length < 4) {
      const randomMeaning =
        wordsData[Math.floor(Math.random() * wordsData.length)].korean;
      if (!options.includes(randomMeaning)) {
        options.push(randomMeaning);
      }
    }
    setRandomOptions(options.sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (selectedMeaning) => {
    setSelectedOption(selectedMeaning);
    const correct = selectedMeaning === currentWord.korean;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
    } else {
      setIncorrectWords((prev) => [
        ...prev,
        { english: currentWord.english, korean: currentWord.korean },
      ]);
    }

    setTimeout(() => {
      setSelectedOption(null);
      setIsCorrect(null);
      setTimeoutMessage(false);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 1000);
  };

  const handleTimeout = () => {
    setIncorrectWords((prev) => [
      ...prev,
      { english: currentWord.english, korean: currentWord.korean },
    ]);
    setTimeoutMessage(true);
    setTimeout(() => {
      setTimeoutMessage(false);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 1000);
  };

  useEffect(() => {
    if (shuffledWords.length === 0) {
      return;
    }

    if (currentIndex >= shuffledWords.length) {
      navigation.navigate("TestingResultScreen", {
        finalScore: score,
        total: shuffledWords.length,
        incorrectWords,
        title: title,
        level: level,
      });
    } else if (currentIndex < shuffledWords.length) {
      setCurrentWord(shuffledWords[currentIndex]);
      generateRandomOptions(shuffledWords[currentIndex]);
      setTimeLeft(10);
    }
  }, [currentIndex, shuffledWords]);

  return (
    <LinearGradient
      colors={["#5A20BB", "#7F9DFF"]} // 그라데이션 색상
      style={styles.container}
    >
      <Text style={styles.progress}>
        {Math.min(currentIndex + 1, shuffledWords.length || wordsData.length)}/
        {shuffledWords.length || wordsData.length}
      </Text>

      <View style={styles.quizBox}>
        {currentWord && <Text style={styles.word}>{currentWord.english}</Text>}
      </View>

      <View style={styles.timerBar}>
        <View
          style={{
            ...styles.timerFill,
            width: `${(timeLeft / 10) * 100}%`,
          }}
        />
      </View>

      {timeoutMessage && (
        <Text style={styles.timeoutMessage}>
          시간 초과! 오답 처리되었습니다.
        </Text>
      )}

      <FlatList
        data={randomOptions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.optionButton,
              timeoutMessage && item === currentWord.korean
                ? styles.correctOption
                : timeoutMessage
                ? styles.wrongOption
                : selectedOption === item
                ? isCorrect
                  ? styles.correctOption
                  : styles.wrongOption
                : null,
            ]}
            onPress={() => handleAnswer(item)}
            disabled={selectedOption !== null || timeoutMessage}
          >
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  progress: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  quizBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
    alignItems: "center",
    alignSelf: "center", // 가운데 정렬
    width: "90%", // 너비를 화면의 90%로 설정
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  word: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#6A0DAD",
  },
  timerBar: {
    height: 15,
    width: "90%", // 너비를 화면의 90%로 설정
    alignSelf: "center", // 가운데 정렬
    backgroundColor: "lightyellow",
    borderRadius: 10,
    marginBottom: 20,
  },
  timerFill: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 10,
  },
  optionButton: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignSelf: "center", // 가운데 정렬
    width: "90%", // 너비를 화면의 90%로 설정
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  optionText: {
    fontSize: 18,
    textAlign: "center",
    color: "#6A0DAD",
  },
  correctOption: {
    backgroundColor: "#d4edda",
    borderColor: "#28a745",
    borderWidth: 2,
  },
  wrongOption: {
    backgroundColor: "#f8d7da",
    borderColor: "#dc3545",
    borderWidth: 2,
  },
  timeoutMessage: {
    textAlign: "center",
    fontSize: 18,
    color: "#FFD700",
    marginBottom: 20,
    fontWeight: "bold",
  },
});

export default TestingScreen;
