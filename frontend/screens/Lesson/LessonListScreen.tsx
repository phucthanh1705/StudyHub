import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { LessonService } from "../../services/lesson.service";
import { AuthService } from "../../services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import style chung
import { colors } from "../../constants/colors";
import { textStyles } from "../../constants/textStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { cardStyles } from "../../constants/cardStyles";
import { imageStyles } from "../../constants/imageStyles";
import { layoutStyles } from "../../constants/layoutStyles";

//assets
import { Images } from "../../constants/images/images";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "LessonList"
>;

interface Lesson {
  lesson_id: number;
  title: string;
  content?: string;
  file?: string;
}

export default function LessonListScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { courseId } = route.params;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState<number | null>(null);

  const fetchUserRole = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Chưa có token. Vui lòng đăng nhập lại.");
      const user = await AuthService.getMe();
      setRoleId(user.role_id);
      return user.role_id;
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.message || "Không lấy được thông tin người dùng."
      );
      return null;
    }
  };

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const userRole = await fetchUserRole();
      if (!userRole) return;

      let data;
      if (userRole === 1 || userRole === 3) {
        data = await LessonService.getAllLessons(courseId);
      } else if (userRole === 2) {
        data = await LessonService.getLessonsByStudent();
      }
      setLessons(data);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải danh sách bài học.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xoá bài học này?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            await LessonService.deleteLesson(id);
            setLessons((prev) => prev.filter((l) => l.lesson_id !== id));
            Alert.alert("Thành công", "Đã xoá bài học.");
          } catch (err: any) {
            Alert.alert("Lỗi", err.message || "Không thể xoá bài học.");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải danh sách bài học...</Text>
      </View>
    );
  }

  return (
    <View style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.lesson}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View
          style={[
            layoutStyles.bannerTextContainer,
            { left: "50%", maxWidth: 150, top: 30 },
          ]}
        >
          <Text style={[textStyles.bannerTitle, { color: colors.background }]}>
            Danh Sách Bài Học
          </Text>
          <Text
            style={[
              textStyles.bannerSubtitle,
              { color: colors.background, marginTop: 10 },
            ]}
          >
            Quản lý bài học của khóa học
          </Text>
        </View>
        <TouchableOpacity
          accessibilityLabel={`back`}
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Tiêu đề */}
      <Text style={textStyles.listTitle}>Danh sách bài học </Text>

      {/* Nút FAB Thêm bài học */}
      {roleId !== 2 && roleId !== 1 && (
        <TouchableOpacity
          accessibilityLabel={`addLesson`}
          style={buttonStyles.fab}
          onPress={() => navigation.navigate("AddLesson", { courseId })}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Nếu không có bài học */}
      {lessons.length === 0 ? (
        <View style={layoutStyles.center}>
          <Image
            source={Images.Common.nothing}
            style={imageStyles.emptyImage}
            resizeMode="contain"
          />
          <Text style={textStyles.emptyText}>Không có bài học nào!</Text>
        </View>
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={(item) => item.lesson_id.toString()}
          renderItem={({ item }) => (
            <View style={cardStyles.card}>
              <TouchableOpacity
                accessibilityLabel={`goLessonDetail`}
                style={{ flex: 1 }}
                onPress={() =>
                  navigation.navigate("LessonDetail", {
                    lessonId: item.lesson_id,
                  })
                }
              >
                <Text
                  style={[
                    textStyles.subjectName,
                    { fontSize: 18, textTransform: "uppercase" },
                  ]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    textStyles.subjectDesc,
                    { fontSize: 16, marginBottom: 5 },
                  ]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.content || "Không có mô tả"}
                </Text>
              </TouchableOpacity>

              {/* Hành động cho Admin/Teacher */}
              {roleId !== 2 && (
                <View style={cardStyles.cardActions}>
                  <TouchableOpacity
                    accessibilityLabel={`editLesson`}
                    style={[
                      buttonStyles.iconBtn,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={() =>
                      navigation.navigate("EditLesson", {
                        lessonId: item.lesson_id,
                        courseId,
                      })
                    }
                  >
                    <Ionicons name="create-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    accessibilityLabel={`deleteLesson`}
                    style={[
                      buttonStyles.iconBtn,
                      { backgroundColor: colors.danger },
                    ]}
                    onPress={() => handleDelete(item.lesson_id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          ListFooterComponent={
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <Image
                source={Images.More.img3}
                style={imageStyles.footerImage}
                resizeMode="contain"
              />
              <Text style={textStyles.footerText}>
                Tiếp tục hành trình học tập của bạn!
              </Text>
              <Text style={textStyles.totalText}>
                Tổng số bài học: {lessons.length}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}