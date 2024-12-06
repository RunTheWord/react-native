import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Modal,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeProvider";

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true); // 알림 상태
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false); // 테마 변경 모달 상태
  const [currentTheme, setCurrentTheme] = useState("light"); // 기본 테마로 설정

  const toggleNotification = () => setIsNotificationEnabled((prev) => !prev);

  const handleResetData = () => {
    Alert.alert(
      "데이터 초기화",
      "앱 데이터를 초기화하시겠습니까? 복구할 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        { text: "확인", onPress: () => console.log("데이터 초기화 완료") },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "계정 삭제",
      "계정을 삭제하시겠습니까? 이 작업은 복구할 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        { text: "확인", onPress: () => console.log("계정 삭제 완료") },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert("로그아웃", "로그아웃하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "확인", onPress: () => console.log("로그아웃 완료") },
    ]);
  };

  return (
    <LinearGradient colors={["#5A20BB", "#000000"]} style={styles.container}>
      <Text style={styles.headerText}>설정</Text>

      {/* 다크모드 */}
      <View style={styles.settingRow}>
        <Text style={[styles.settingLabel, { color: theme.text }]}>
          다크모드
        </Text>
        <Switch
          value={theme.mode === "dark"}
          onValueChange={toggleTheme}
          thumbColor={theme.mode === "dark" ? "#FFF" : theme.primary}
          trackColor={{ false: "#DDD", true: theme.primary }}
        />
      </View>

      {/* 알림 */}
      <View style={styles.settingRow}>
        <Text style={[styles.settingLabel, { color: theme.text }]}>
          알림 받기
        </Text>
        <Switch
          value={isNotificationEnabled}
          onValueChange={toggleNotification}
          thumbColor={isNotificationEnabled ? "#FFF" : theme.primary}
          trackColor={{ false: "#DDD", true: theme.primary }}
        />
      </View>

      {/* 테마 변경 */}
      <TouchableOpacity
        style={styles.settingRow}
        onPress={() => setIsThemeModalVisible(true)}
      >
        <Text style={[styles.settingLabel, { color: theme.text }]}>
          테마 변경
        </Text>
        <Text style={[styles.settingValue, { color: theme.text }]}>
          {currentTheme}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingRow}
        onPress={() => console.log("개인정보처리방침")}
      >
        <Text style={styles.settingLabel}>개인정보처리방침</Text>
      </TouchableOpacity>

      {/* 앱 버전 */}
      <View style={styles.settingRow}>
        <Text style={[styles.settingLabel, { textAlign: "center" }]}>
          앱 버전: 1.0.0
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.settingRow, styles.resetButton]}
        onPress={handleResetData}
      >
        <Text style={styles.settingLabel}>데이터 초기화</Text>
      </TouchableOpacity>

      {/* 계정 삭제 */}
      <TouchableOpacity
        style={[styles.settingRow, styles.deleteAccount]}
        onPress={handleDeleteAccount}
      >
        <Text style={styles.settingLabel}>계정 삭제</Text>
      </TouchableOpacity>

      {/* 로그아웃 */}
      <TouchableOpacity
        style={[styles.settingRow, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.settingLabel}>로그아웃</Text>
      </TouchableOpacity>

      {/* 테마 모달 */}
      <Modal
        visible={isThemeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsThemeModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>테마 변경</Text>
            {["light", "dark"].map((themeName) => (
              <TouchableOpacity
                key={themeName}
                style={styles.themeOption}
                onPress={() => {
                  setCurrentTheme(themeName);
                  setIsThemeModalVisible(false);
                }}
              >
                <Text style={styles.themeText}>{themeName.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsThemeModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 개발자 정보 */}
      <Text style={styles.developerInfo}>개발자 정보: RunTheWord 팀</Text>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    marginTop: 50,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 30,
    textAlign: "center",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 14,
  },
  deleteAccount: {
    backgroundColor: "#FFFD9E",
  },
  logoutButton: {
    backgroundColor: "#91FFFC",
  },
  resetButton: {
    backgroundColor: "#FAA2FF", // 파란 계열로 변경
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
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  themeOption: {
    padding: 10,
    width: "100%",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  themeText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#6A0DAD",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  developerInfo: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 20,
    color: "#666",
  },
});
