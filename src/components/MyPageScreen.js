import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function MyPageScreen() {
  const [isRankingInfoVisible, setRankingInfoVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [danbiDays, setDanbiDays] = useState(0); // danbi의 학습일

  // 등급 계산 함수
  const calculateRank = (days) => {
    if (days >= 1000) return "다이아";
    if (days >= 365) return "플래티넘";
    if (days >= 100) return "골드";
    if (days >= 30) return "실버";
    return "브론즈";
  };

  // 등급에 따른 아이콘 반환
  const getRankIcon = (rank) => {
    switch (rank) {
      case "다이아":
        return require("../../assets/diamond.png");
      case "플래티넘":
        return require("../../assets/platinum.png");
      case "골드":
        return require("../../assets/gold.png");
      case "실버":
        return require("../../assets/sliver.png");
      default:
        return require("../../assets/bronze.png");
    }
  };

  // 더미 데이터 설정
  useEffect(() => {
    const dummyChartData = [
      { name: "yes490411" },
      { name: "danbi" },
      { name: "junny71387" },
      { name: "miniG" },
      { name: "AyoungKim" },
      { name: "JohnDoe" },
      { name: "JaneDoe" },
      { name: "Tommy" },
      { name: "Lucy" },
    ];
    // danbi의 학습일 랜덤 설정
    const randomDaysForDanbi = 900;

    // 모든 사용자 데이터 업데이트 및 정렬
    const updatedUsers = dummyChartData
      .map((user, index) => ({
        ...user,
        days:
          user.name === "danbi"
            ? randomDaysForDanbi
            : Math.floor(Math.random() * (900 - 30 + 1)) + 30, // danbi는 고정, 다른 사용자는 랜덤
      }))
      .sort((a, b) => b.days - a.days); // 학습일 기준 내림차순 정렬

    setDanbiDays(randomDaysForDanbi); // danbi의 일수 설정
    setUsers(updatedUsers); // 사용자 데이터 업데이트
  }, []);

  const toggleRankingInfo = () => {
    setRankingInfoVisible(!isRankingInfoVisible);
  };

  return (
    <LinearGradient colors={["#5A20BB", "#000000"]} style={styles.container}>
      {/* 사용자 정보 */}
      {users.length > 0 && (
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfo}>
            <Image
              source={getRankIcon(calculateRank(danbiDays))}
              style={styles.rankIcon}
            />
            <Text style={styles.userName}>danbi 님</Text>
          </View>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={toggleRankingInfo}
          >
            <Image
              source={require("../../assets/info.png")}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>등급 안내</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 등급 목표 및 진행 상태 */}
      <LinearGradient
        colors={["#FFFEE3", "#FFFD9E"]}
        style={styles.progressContainer}
      >
        <Text style={styles.rankProgressText}>다이아 등급까지</Text>
        <Text style={styles.daysLeftText}>100일 남았습니다.</Text>
      </LinearGradient>

      {/* 실시간 차트 */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>실시간 차트</Text>
        <ScrollView style={styles.chartList}>
          {users.map((user, index) => (
            <View key={index} style={styles.chartItem}>
              <LinearGradient
                colors={
                  index === 0 ? ["#FFD700", "#FFA500"] : ["#F5F5F5", "#E0E0E0"]
                }
                style={styles.chartCard}
              >
                <Text style={styles.chartRank}>
                  {index === 0 ? "👑 1" : index + 1}
                </Text>
                <View style={styles.chartDetails}>
                  <Text style={styles.chartName}>{user.name}</Text>
                  <Text style={styles.chartDays}>{user.days} 일</Text>
                </View>
              </LinearGradient>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 등급 안내 모달 */}
      <Modal
        visible={isRankingInfoVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={toggleRankingInfo}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>등급 안내</Text>
            <View style={styles.rankInfoContainer}>
              {[
                {
                  rank: "Bronze",
                  miles: "1~29일",
                  icon: require("../../assets/bronze.png"),
                },
                {
                  rank: "Silver",
                  miles: "30~99일",
                  icon: require("../../assets/sliver.png"),
                },
                {
                  rank: "Gold",
                  miles: "100~364일",
                  icon: require("../../assets/gold.png"),
                },
                {
                  rank: "Platinum",
                  miles: "365~999일",
                  icon: require("../../assets/platinum.png"),
                },
                {
                  rank: "Diamond",
                  miles: "1000일 이상",
                  icon: require("../../assets/diamond.png"),
                },
              ].map((item, index) => (
                <View key={index} style={styles.rankCard}>
                  <Image source={item.icon} style={styles.rankIcon} />
                  <View style={styles.rankDetails}>
                    <Text style={styles.rankName}>{item.rank}</Text>
                    <Text style={styles.rankMiles}>{item.miles} 기준 등급</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  userInfoContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
    marginTop: 70,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5A20BB",
  },
  infoButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    width: 18,
    height: 18,
    marginRight: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#5A20BB",
  },
  progressContainer: {
    width: "90%",
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  rankProgressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5A20BB",
  },
  daysLeftText: {
    fontSize: 14,
    color: "#5A20BB",
  },
  chartContainer: {
    width: "90%",
    height: "70%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    marginTop: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#5A20BB",
  },
  chartItem: {
    marginBottom: 12,
  },
  chartCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  chartRank: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 15,
    color: "#5A20BB",
  },
  chartDetails: {
    flex: 1,
  },
  chartName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  chartDays: {
    fontSize: 14,
    color: "#666",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  rankInfoContainer: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  rankCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  rankInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9F9F9",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  rankName: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#5A20BB",
  },
  rankMiles: {
    fontSize: 15,
    fontWeight: 550,
    color: "#666",
  },
});
