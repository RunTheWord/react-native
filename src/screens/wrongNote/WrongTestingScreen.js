import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { updateDoc, arrayRemove } from "firebase/firestore";

const WrongTestingScreen = ({ route, navigation }) => {
  const { title, words } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [randomOptions, setRandomOptions] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    if (Array.isArray(words) && words.length > 1) {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      setCurrentIndex(0); // Reset currentIndex
    }
  }, [words]);

  useEffect(() => {
    if (shuffledWords.length > 0 && currentIndex < shuffledWords.length) {
      const word = shuffledWords[currentIndex];
      setCurrentWord(word);
      generateRandomOptions(word);
    } else if (
      shuffledWords.length > 0 &&
      currentIndex >= shuffledWords.length
    ) {
      navigation.navigate("WrongTestingResultScreen", {
        title: title,
        finalScore: score,
        total: shuffledWords.length,
      });
    }
  }, [currentIndex, shuffledWords]);

  const generateRandomOptions = (word) => {
    if (!word) return;
    const options = [word.korean];
    while (options.length < 4) {
      const randomMeaning =
        words[Math.floor(Math.random() * words.length)].korean;
      if (!options.includes(randomMeaning)) {
        options.push(randomMeaning);
      }
    }
    setRandomOptions(options.sort(() => Math.random() - 0.5));
  };
  const handleAnswer = async (selectedMeaning) => {
    setSelectedOption(selectedMeaning);
    const correct = selectedMeaning === currentWord.korean;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      // Firebase에서 맞춘 단어 삭제 (단일 단어 제거)
      try {
        const docRef = doc(db, `wrong_notes_${title}`, currentWord.id);
        await updateDoc(docRef, {
          incorrectWords: arrayRemove({
            english: currentWord.english,
            korean: currentWord.korean,
          }),
        });
      } catch (error) {
        console.error("Error removing correct word from DB:", error);
      }
    }

    setTimeout(() => {
      setSelectedOption(null);
      setIsCorrect(null);
      setCurrentIndex((prev) => prev + 1);
    }, 500);
  };

  if (!Array.isArray(words) || words.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>오답 노트가 비어 있습니다.</Text>
      </View>
    );
  }

  if (!currentWord) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>단어를 불러오는 중입니다...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress */}
      <Text style={styles.progress}>
        {currentIndex + 1}/{shuffledWords.length}
      </Text>

      {/* Current Word */}
      <View style={styles.quizBox}>
        <Text style={styles.word}>{currentWord.english}</Text>
      </View>

      {/* Options */}
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
                : null,
            ]}
            onPress={() => handleAnswer(item)}
            disabled={selectedOption !== null}
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
    backgroundColor: "#6A0DAD",
  },
  progress: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFF",
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
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    color: "#FFF",
  },
});

export default WrongTestingScreen;
