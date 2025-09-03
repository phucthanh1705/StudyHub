import React, { useEffect, useState } from "react";
import { StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthService } from "../services/auth.service";

import HomeScreen from "../screens/HomeScreen";
import AccountScreen from "../screens/Auth/AccountScreen";
import CourseListScreen from "../screens/Course/CourseListScreen";
import StudentCourseListScreen from "../screens/ClassMember/StudentCourseListScreen";
import MoreScreen from "../screens/MoreScreen";
import UserTimetableScreen from "../screens/Timetable/UserTimetableScreen"; 
import AdminUserListScreen from "../screens/Timetable/AdminUserListScreen";
import { colors } from "../constants/colors";

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  const [roleId, setRoleId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const user = await AuthService.getMe();
        setRoleId(user.role_id);
      } catch {
        setRoleId(null);
      }
    };
    fetchRole();
  }, []);

  const screenOptions = ({ route }: { route: any }) => ({
    tabBarIcon: ({ focused, color, size }: any) => {
      let iconName = "home-outline";

      if (route.name === "Home") iconName = focused ? "home" : "home-outline";
      else if (route.name === "Course" || route.name === "CourseList")
        iconName = focused ? "book" : "book-outline";
      else if (route.name === "Account")
        iconName = focused ? "person" : "person-outline";
      else if (route.name === "More")
        iconName = focused ? "apps" : "apps-outline";
      else if (route.name === "StudentCourseList")
        iconName = focused ? "clipboard" : "clipboard-outline";
      else if (route.name === "Timetable" || route.name === "TimetableUsers")
        iconName = focused ? "calendar" : "calendar-outline";

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: "#888",
    headerShown: false,
    tabBarStyle: styles.tabBar,
    tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
  });

  const renderTabs = () => {
    if (roleId === 1) {
      // Admin → Trang chọn user để xem TKB
      return (
        <>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen
            name="TimetableUsers"
            component={AdminUserListScreen}
            options={{ title: "Thời khóa biểu" }}
          />
          <Tab.Screen name="Course" component={CourseListScreen} />
          <Tab.Screen name="Account" component={AccountScreen} />
          <Tab.Screen
            name="More"
            component={MoreScreen}
            options={{ title: "Dịch vụ" }}
          />
        </>
      );
    } else if (roleId === 3) {
      // Teacher → Xem TKB của chính mình
      return (
        <>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen
            name="Timetable"
            component={UserTimetableScreen}
            options={{ title: "Thời khóa biểu" }}
          />
          <Tab.Screen
            name="CourseList"
            component={CourseListScreen}
            options={{ title: "Khóa học" }}
          />
          <Tab.Screen name="Account" component={AccountScreen} />
        </>
      );
    } else {
      // Student → Xem TKB của chính mình
      return (
        <>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen
            name="Timetable"
            component={UserTimetableScreen}
            options={{ title: "Thời khóa biểu" }}
          />
          <Tab.Screen
            name="CourseList"
            component={CourseListScreen}
            options={{ title: "Khóa học" }}
          />
          <Tab.Screen
            name="StudentCourseList"
            component={StudentCourseListScreen}
            options={{ title: "Đăng ký" }}
          />
          <Tab.Screen name="Account" component={AccountScreen} />
        </>
      );
    }
  };

  return (
    <Tab.Navigator screenOptions={screenOptions}>{renderTabs()}</Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    height: Platform.OS === "ios" ? 85 : 70,
    paddingTop: 5,
    paddingBottom: 5,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
  },
});
