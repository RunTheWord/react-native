import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Swiper from "react-native-swiper";

const OnboardingScreen = ({ navigation }) => {
  const slides = [
    {
      title: "오늘의 알림",
      description: "알림 기능을 통해 매일 공부해야 할 분량을 챙길 수 있어요",
      image: require("../../assets/message.png"), // 이미지 경로를 수정하세요
    },
    {
      title: "단어 시험도 보고, 오답노트 관리도 하고",
      description:
        "단어 시험에서 틀린 단어만 \n오답노트로 따로 모아 관리할 수 있어요",
      image: require("../../assets/test.png"), // 이미지 경로를 수정하세요
    },
    {
      title: "순위권에 들기 도전",
      description: "꾸준한 단어 학습을 통해 나의 순위를 올릴 수 있어요",
      image: require("../../assets/Trophyl.png"), // 이미지 경로를 수정하세요
    },
  ];

  return (
    <View style={styles.container}>
      <Swiper
        loop={false}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        paginationStyle={styles.pagination}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Image source={slide.image} style={styles.image} />
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </Swiper>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.signupText}>회원가입</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginText}>로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  slide: {
    flex: 0.75,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").width * 0.6,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: -150,
  },
  buttonContainer: {
    flex: 0.25,
    justifyContent: "center",
    alignItems: "center",
  },
  signupButton: {
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    paddingHorizontal: 140,
    borderRadius: 25,
    marginBottom: 15,
  },
  signupText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButton: {
    borderColor: "#6200EE",
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 140,
    borderRadius: 25,
  },
  loginText: {
    color: "#6200EE",
    fontSize: 16,
    fontWeight: "bold",
  },
  dot: {
    backgroundColor: "#ccc",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#6200EE",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  pagination: {
    bottom: 50,
  },
});

export default OnboardingScreen;
