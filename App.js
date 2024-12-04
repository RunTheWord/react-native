import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import { auth } from "./firebaseConfig"; // Firebase auth 가져오기
import LoginScreen from "./src/components/LoginScreen";
import SignUpScreen from "./src/components/SignUpScreen";
import HomeScreen from "./src/components/HomeScreen";
import MyPageScreen from "./src/components/MyPageScreen";
import SettingsScreen from "./src/components/SettingsScreen";
import Study from "./src/screens/wordstudy/Study";
import RealStudyScreen from "./src/screens/wordstudy/RealStudyScreen";
import { ThemeProvider, useTheme } from "./src/context/ThemeProvider";
import TestLevelScreen from "./src/screens/wordtest/TestLevelScreen";
import TestingScreen from "./src/screens/wordtest/TestingScreen";
import TestingResultScreen from "./src/screens/wordtest/TestingResultScreen";
import WordTestScreen from "./src/screens/wordtest/WordTestScreen";
import WrongNoteScreen from "./src/screens/wrongNote/WrongNoteScreen";
import WrongNoteLevelScreen from "./src/screens/wrongNote/WrongNoteLevelScreen";
import WrongTestingScreen from "./src/screens/wrongNote/WrongTestingScreen";
import WrongTestingResultScreen from "./src/screens/wrongNote/WrongTestingResultScreen";
import "react-native-get-random-values";
import OnboardingScreen from "./src/components/OnboardingScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/** Home Stack Navigator */
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="WordTestScreen" component={WordTestScreen} />

    <Stack.Screen name="WordStudyScreen" component={Study} />
    <Stack.Screen name="RealStudyScreen" component={RealStudyScreen} />

    <Stack.Screen name="TestLevelScreen" component={TestLevelScreen} />
    <Stack.Screen name="TestingScreen" component={TestingScreen} />
    <Stack.Screen name="TestingResultScreen" component={TestingResultScreen} options={{ headerShown: false }} />

    <Stack.Screen name="WrongNoteScreen" component={WrongNoteScreen} />
    <Stack.Screen name="WrongTestingScreen" component={WrongTestingScreen} />
    <Stack.Screen
      name="WrongTestingResultScreen"
      component={WrongTestingResultScreen}
    />
    <Stack.Screen
      name="WrongNoteLevelScreen"
      component={WrongNoteLevelScreen}
    />
  </Stack.Navigator>
);

/** MyPage Stack Navigator */
const MyPageStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MyPage"
      component={MyPageScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

/** Settings Stack Navigator */
const SettingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user); // 로그인 상태 업데이트
    });
    return unsubscribe; // 언마운트 시 리스너 해제
  }, []);

  // if (isLoggedIn === null) {
  //   return <LoadingScreen />;
  // }

  return (
    <ThemeProvider>
      <NavigationContainer>
        {true ? (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName;
                if (route.name === "Home") iconName = "home-outline";
                else if (route.name === "MyPage") iconName = "person-outline";
                else if (route.name === "Settings")
                  iconName = "settings-outline";

                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "#6A0DAD",
              tabBarInactiveTintColor: "gray",
              tabBarStyle: {
                backgroundColor: "#FFF",
                borderTopWidth: 0,
                elevation: 5,
              },
              headerShown: false,
            })}
          >
            <Tab.Screen
              name="Home"
              component={HomeStack}
              options={{ tabBarLabel: "홈" }}
            />
            <Tab.Screen
              name="MyPage"
              component={MyPageStack}
              options={{ tabBarLabel: "마이페이지" }}
            />
            <Tab.Screen
              name="Settings"
              component={SettingsStack}
              options={{ tabBarLabel: "설정" }}
            />
          </Tab.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen 
              name="Onboarding"
              component={OnboardingScreen}
              options={{headerShown:false}}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{
                headerTitle: "회원가입",
                headerStyle: { backgroundColor: "#6A0DAD" },
                headerTintColor: "#FFF",
                headerTitleStyle: { fontWeight: "bold" },
              }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </ThemeProvider>
  );
}
