// App.tsx
import React, { useEffect, useState, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppNavigator from "./navigation/AppNavigator";
import { setupAxios } from "./api/axiosInstance";
import { AuthService } from "./services/auth.service";
import { AuthContext } from "./src/contexts/AuthContext";

export default function App() {
  const [ready, setReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      await setupAxios();

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        setReady(true);
        return;
      }

      try {
        await AuthService.getMe(); // token còn hạn
        setIsLoggedIn(true);
      } catch {
        await AsyncStorage.removeItem("token"); // token hết hạn
        setIsLoggedIn(false);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const authValue = useMemo(
    () => ({ isLoggedIn, setLoggedIn: setIsLoggedIn }),
    [isLoggedIn]
  );

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authValue}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
