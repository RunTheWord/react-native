import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const TestingScreen = () => {
  const navigation = useNavigation();

  // 상태 관리
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 문제의 인덱스
  const [timeLeft, setTimeLeft] = useState(10); // 남은 시간 (초)
  const [score, setScore] = useState(0); // 점수
  const [incorrectWords, setIncorrectWords] = useState([]); // 오답 리스트
  const [randomOptions, setRandomOptions] = useState([]); // 보기 목록
  const [currentWord, setCurrentWord] = useState(null); // 현재 문제 단어
  const [shuffledWords, setShuffledWords] = useState([]); // 섞인 단어 목록
  const [selectedOption, setSelectedOption] = useState(null); // 선택한 보기
  const [isCorrect, setIsCorrect] = useState(null); // 정답 여부

  // 샘플 단어 데이터
  const wordsData = [
    { word: "engross", meaning: "몰두하게 만들다" },
    { word: "enhancement", meaning: "향상" },
    { word: "enroll", meaning: "등록하다" },
    { word: "provoke", meaning: "유발하다" },
    { word: "prey", meaning: "먹이" },
    { word: "paradoxically", meaning: "역설적으로" },
    { word: "gem", meaning: "보석" },
    { word: "extinction", meaning: "멸종" },
    { word: "expire", meaning: "만기가 되다" },
    { word: "protrayal", meaning: "묘사" },
    { word: "precaution", meaning: "예방" },
    { word: "preparation", meaning: "준비" },
    { word: "remake", meaning: "새로 만들다" },
    { word: "convenient", meaning: "편리한" },
    { word: "converse", meaning: "반대의" },
    { word: "currnetly", meaning: "현재는" },
    { word: "cyclical", meaning: "순환하는" },
    { word: "decode", meaning: "해독하다" },
    { word: "dominion", meaning: "영토" },
    { word: "dusk", meaning: "황혼" },
  ];

  // 첫 로드 시 단어를 섞고 첫 문제를 설정
  useEffect(() => {
    const shuffled = [...wordsData].sort(() => Math.random() - 0.5); // 단어 섞기
    setShuffledWords(shuffled); // 섞인 단어 저장
    setCurrentWord(shuffled[0]); // 첫 번째 문제 설정
    generateRandomOptions(shuffled[0]); // 첫 번째 문제 보기를 생성
  }, []);

  // 타이머 동작 (1초마다 감소)
  useEffect(() => {
    if (timeLeft === 0) {
      handleTimeout(); // 시간이 다 되면 시간초과 처리
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [timeLeft]);

  // 랜덤 보기 생성
  const generateRandomOptions = (word) => {
    const options = [word.meaning]; 
    while (options.length < 4) {
      const randomMeaning =
        wordsData[Math.floor(Math.random() * wordsData.length)].meaning; 
      if (!options.includes(randomMeaning)) {
        options.push(randomMeaning); // 중복 방지 후 추가
      }
    }
    setRandomOptions(options.sort(() => Math.random() - 0.5)); // 보기 순서 섞기
  };

  // 정답 선택 처리
  const handleAnswer = (selectedMeaning) => {
    setSelectedOption(selectedMeaning); // 선택한 보기 저장
    const correct = selectedMeaning === currentWord.meaning; // 정답 여부 확인
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1); 
    } else {
      setIncorrectWords((prev) => [
        ...prev,
        { word: currentWord.word, meaning: currentWord.meaning }, 
      ]);
    }

    // 1초 후 다음 문제로 이동
    setTimeout(() => {
      setSelectedOption(null);
      setIsCorrect(null);
      nextQuestion();
    }, 1000);
  };

  // 시간초과 처리
  const handleTimeout = () => {
    setIncorrectWords((prev) => [
      ...prev,
      { word: currentWord.word, meaning: currentWord.meaning },
    ]);
    // 마지막 문제가 시간초과되면 왜 오답 리스트에 저장이 안되지?
    setTimeout(() => {
      nextQuestion();
    }, 1000);
  };

  // 다음 문제로 이동
  const nextQuestion = () => {
    if (currentIndex < shuffledWords.length - 1) {
      const nextIndex = currentIndex + 1; 
      setCurrentIndex(nextIndex);
      setCurrentWord(shuffledWords[nextIndex]); // 다음 문제 설정
      generateRandomOptions(shuffledWords[nextIndex]); // 다음 문제 보기를 생성
      setTimeLeft(10); 
    } else {
      // 모든 문제를 풀었을 경우 결과 화면으로 이동
      navigation.navigate("TestingResultScreen", {
        finalScore: score,
        total: shuffledWords.length,
        incorrectWords,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* 진행 상황 표시 */}
      <Text style={styles.progress}>
        {currentIndex + 1}/{shuffledWords.length || wordsData.length}
      </Text>

      {/* 문제 표시 */}
      <View style={styles.quizBox}>
        {currentWord && <Text style={styles.word}>{currentWord.word}</Text>}
      </View>

      {/* 타이머 표시 */}
      <View style={styles.timerBar}>
        <View
          style={{
            ...styles.timerFill,
            width: `${(timeLeft / 10) * 100}%`, // 남은 시간에 따른 너비
          }}
        />
      </View>

      {/* 보기 표시 */}
      <FlatList
        data={randomOptions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOption === item
                ? isCorrect
                  ? styles.correctOption 
                  : styles.wrongOption 
                : item === currentWord.meaning && selectedOption !== null
                ? styles.correctOption // 시간초과 시 정답 표시
                : null,
            ]}
            onPress={() => handleAnswer(item)}
            disabled={selectedOption !== null} // 선택 비활성화
          >
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#6A0DAD", // 보라색 배경
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
    width: "100%",
    backgroundColor: "lightyellow", // 밝은 노란색
    borderRadius: 10,
    marginBottom: 20,
  },
  timerFill: {
    height: "100%",
    backgroundColor: "#FFD700", // 진한 노란색
    borderRadius: 10,
  },
  optionButton: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
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
});

export default TestingScreen;
