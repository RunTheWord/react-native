import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthProvider";

export default function Home() {
  const navigation = useNavigation();
  const translateY = new Animated.Value(0);
  // const userName = 'Danbi';
  const user = useContext(AuthContext);
  console.log("User object:", user.user);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      if (gestureState.dy < 0) {
        translateY.setValue(200 + gestureState.dy);
      } else if (gestureState.dy > 0 && translateY._value < 200) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: () => {
      if (translateY._value < 100) {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(translateY, {
          toValue: 100,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <LinearGradient colors={["#5A20BB", "#000000"]} style={styles.container}>
      {/* <Text style={styles.greeting}>{userName}님, 안녕하세요!</Text> */}
      <Text style={styles.greeting}>
        {user.user && user.user.email
          ? `${user.user.email.split("@")[0].slice(0, 3)}님, 안녕하세요!`
          : "안녕하세요!"}
      </Text>
      <View style={styles.cardContainer}>
        <View style={styles.row}>
          <LinearGradient
            colors={["#FFFEE3", "#FFFD9E"]}
            style={styles.gradientBackground}
          >
            <TouchableOpacity
              style={styles.touchableArea}
              onPress={() => navigation.navigate("WordTestScreen")}
            >
              <Text style={styles.cardTitle}>단어 시험</Text>
              <Image
                source={require("../../assets/images/exam.png")}
                style={styles.cardImage}
              />
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            colors={["#DEFFEE", "#91FFFC"]}
            style={styles.gradientBackground}
          >
            <TouchableOpacity
              style={styles.touchableArea}
              onPress={() => navigation.navigate("WrongNoteScreen")}
            >
              <Text style={styles.cardTitleTopCenter}>오답 노트</Text>
              <Image
                source={require("../../assets/images/wrong.png")}
                style={styles.cardImageLeftBottom}
              />
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <View style={styles.row}>
          <LinearGradient
            colors={["#FAA2FF", "#FDE3FF"]}
            style={styles.gradientBackground}
          >
            <TouchableOpacity
              style={[styles.touchableArea, styles.wideCard]}
              onPress={() => navigation.navigate("WordStudyScreen")}
            >
              <Text style={styles.cardTitle2}>단어 학습</Text>
              <Image
                source={require("../../assets/images/book.png")}
                style={styles.cardImageRightBottom}
              />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.pullUpBar, { transform: [{ translateY }] }]}
      >
        <Image
          source={require("../../assets/images/line.png")}
          style={styles.dragHandleImage}
        />
        <Image
          source={require("../../assets/images/line.png")}
          style={styles.dragHandleImage}
        />
        <Text style={styles.goalText}>오늘 목표까지 38개 남았어요!</Text>
        <View style={styles.progressContainer}>
          <Image
            source={require("../../assets/images/success.png")}
            style={styles.progressIcon}
          />
          <Text style={styles.progressText}>20%</Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#6A0DAD",
    paddingTop: 100,
  },
  greeting: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  cardContainer: { width: "90%", marginTop: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dragHandleImage: {
    width: 50,
    height: 4,
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 10,
    margin: 5,
    overflow: "hidden",
    justifyContent: "center", // 세로 가운데 정렬
    alignItems: "center", // 가로 가운데 정렬
    height: 190,
  },
  touchableArea: {
    flex: 1,
    width: "100%", // 터치 가능한 영역을 LinearGradient와 동일하게
    justifyContent: "center",
    alignItems: "center",
  },
  wideCard: {
    width: "90%",
    alignSelf: "center",
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 30,
    fontWeight: "bold",
  },
  cardTitle2: {
    fontSize: 25,
    fontWeight: "bold",
    position: "absolute",
    top: 10,
    left: 10,
  },
  cardImageRightBottom: {
    width: 100,
    height: 100,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  cardImageLeftBottom: {
    width: 80,
    height: 105.36,
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  pullUpBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "#EDE7F6",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
  },
  cardTitleTopCenter: {
    fontSize: 20,
    fontWeight: "bold",
    position: "absolute",
    top: 20,
    alignSelf: "center",
  },
});
