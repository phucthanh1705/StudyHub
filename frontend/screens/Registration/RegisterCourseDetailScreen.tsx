import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { RegisterCourseService } from "../../services/registercourse.service";
import Ionicons from "react-native-vector-icons/Ionicons";
// Import style constants
import { imageStyles } from "../../constants/imageStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { inputStyles } from "../../constants/inputStyles";
import { textStyles } from "../../constants/textStyles";
import { colors } from "../../constants/colors";

//assets
import { Images } from "../../constants/images/images";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RegisterCourseDetail"
>;

export default function RegisterCourseDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();
  const { registerId } = route.params;

  const [loading, setLoading] = useState(true);
  const [registerCourse, setRegisterCourse] = useState<any>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const fetchRegisterCourse = async () => {
    try {
      setLoading(true);
      const data = await RegisterCourseService.getById(registerId);
      setRegisterCourse(data || null);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải chi tiết đăng ký.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisterCourse();
  }, [registerId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (!registerCourse) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, color: "red" }}>
          Không tìm thấy đăng ký học phần.
        </Text>
        <Text style={styles.backText} onPress={() => navigation.goBack()}>
          Quay lại
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <View style={styles.bannerWrapper}>
        <Image
          source={Images.TopBanner.registerTime}
          style={styles.banner}
          resizeMode="cover"
        />
        {/* Nút quay lại */}
        <TouchableOpacity
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={[styles.bannerTextContainer, { left: "40%", top: "35%" }]}>
          <Text style={[styles.bannerTitle, { color: colors.primary }]}>
            CHI TIẾT ĐĂNG KÝ
          </Text>
          <Text
            style={[
              styles.bannerSubtitle,
              { color: colors.primary, marginTop: 20 },
            ]}
          >
            Thông tin chi tiết về đăng ký khóa học
          </Text>
        </View>
      </View>

      {/* Card thông tin */}
      <View style={styles.card}>
        <Text style={styles.cardRow}>
          <Text style={styles.label}>Người dùng: </Text>
          {registerCourse.user_name} ({registerCourse.email})
        </Text>
        <Text style={styles.cardRow}>
          <Text style={styles.label}>Thời gian tạo: </Text>
          {formatDate(registerCourse.create_at)}
        </Text>
        <Text style={styles.cardRow}>
          <Text style={styles.label}>Đăng ký: </Text>
          {formatDate(registerCourse.begin_register)} -{" "}
          {formatDate(registerCourse.end_register)}
        </Text>
        <Text style={styles.cardRow}>
          <Text style={styles.label}>Đóng học phí: </Text>
          {formatDate(registerCourse.due_date_start)} -{" "}
          {formatDate(registerCourse.due_date_end)}
        </Text>
        <Text style={styles.cardRow}>
          <Text style={styles.label}>Học kỳ / Năm học: </Text>
          {registerCourse.semester} / {registerCourse.year}
        </Text>
        <Text style={[styles.cardRow, { color: "red", fontWeight: "600" }]}>
          <Text style={styles.label}>Học phí: </Text>
          {registerCourse.tuition?.toLocaleString("vi-VN") || 0} VNĐ
        </Text>
        <Text
          style={[
            styles.cardRow,
            { color: registerCourse.status === "Mở" ? "green" : "red" },
          ]}
        >
          <Text style={styles.label}>Trạng thái: </Text>
          {registerCourse.status}
        </Text>
      </View>

      {/* Danh sách khóa học đã đăng ký */}
      {registerCourse.courses && registerCourse.courses.length > 0 && (
        <View style={styles.card}>
          <Text style={[styles.label, { marginBottom: 8 }]}>
            Danh sách môn học đã đăng ký:
          </Text>
          {registerCourse.courses.map((course: any, idx: number) => (
            <View key={idx} style={styles.courseItem}>
              <Text style={styles.courseName}>{course.subject_name}</Text>
              <Text style={styles.coursePrice}>
                {course.price?.toLocaleString("vi-VN")} VNĐ
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Ảnh minh họa dưới */}
      <View style={styles.bottomImageContainer}>
        <Image
          source={Images.More.img4}
          style={styles.bottomImage}
          resizeMode="contain"
        />
        <Text style={styles.footerText}>Tiếp tục học tập và phát triển!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  backText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6C63FF",
    fontWeight: "600",
  },
  bannerWrapper: { position: "relative" },
  banner: { width: "100%", height: 180 },
  bannerTextContainer: {
    position: "absolute",
    bottom: 15,
    left: 20,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#f0f0f0",
  },
  card: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  label: { fontWeight: "600", color: "#333" },
  cardRow: {
    fontSize: 15,
    color: "#444",
    marginBottom: 8,
  },
  bottomImageContainer: { marginTop: 20, alignItems: "center" },
  bottomImage: { width: "70%", height: 160 },
  footerText: { marginTop: 10, color: "#777", fontSize: 14 },

  courseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  courseName: { fontSize: 15, color: "#333" },
  coursePrice: { fontSize: 14, color: "red" },
});