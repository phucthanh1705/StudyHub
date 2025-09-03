import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { CourseService } from "../../services/course.service";
import { SubjectService } from "../../services/subject.service";
import { AuthService } from "../../services/auth.service";
import Ionicons from "react-native-vector-icons/Ionicons";
// Import style chung
import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { imageStyles } from "../../constants/imageStyles";
import { inputStyles } from "../../constants/inputStyles";
import { colors } from "../../constants/colors";
//assets
import { Images } from "../../constants/images/images";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CourseDetail"
>;

interface Course {
  course_id: number;
  subject_id: number
  subject_name: string;
  semester: string;
  year: number;
  price: number;
  numofperiods: number;
}

interface Subject {
  subject_id: number;
  name: string;
  description?: string;
}

export default function CourseDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { courseId } = route.params;

  const [course, setCourse] = useState<Course | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<number | null>(null);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      let data;
      if (role === 1) data = await CourseService.getByIdAdmin(courseId);
      else if (role === 2) data = await CourseService.getByIdStudent(courseId);
      else if (role === 3) data = await CourseService.getByIdTeacher(courseId);
      else throw new Error("Không xác định quyền người dùng.");

      setCourse(data);

      // Gọi API lấy chi tiết môn học
      if (data.subject_id) {
        const sub = await SubjectService.getById(data.subject_id);
        setSubject(sub);
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải chi tiết khóa học.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const me = await AuthService.getMe();
        setRole(me.role_id);
      } catch (error) {
        Alert.alert("Lỗi", "Không thể xác định quyền người dùng.");
      }
    })();
  }, []);

  useEffect(() => {
    if (role !== null) fetchCourse();
  }, [role]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text>Đang tải chi tiết khóa học...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy thông tin khóa học.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <View>
        <Image
          source={Images.TopBanner.course}
          style={styles.banner}
          resizeMode="cover"
        />
        <View
          style={[
            layoutStyles.bannerTextContainer,
            { left: "50%", maxWidth: 150, top: 30 },
          ]}
        >
          <Text style={[textStyles.bannerTitle, { color: colors.primary }]}>
            Chi Tiết Khóa Học
          </Text>
          <Text
            style={[
              textStyles.bannerSubtitle,
              { color: colors.primary, marginTop: 20 },
            ]}
          >
            Thông tin chi tiết của khóa học
          </Text>
        </View>
        <TouchableOpacity
          accessibilityLabel={`back`}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tiêu đề */}
      <Text style={styles.pageTitle}>Chi Tiết Khóa Học</Text>

      {/* Thông tin khóa học */}
      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={18} color="#6C63FF" />
          <Text style={styles.info}>Tên khóa học: {course.subject_name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color="#6C63FF" />
          <Text style={styles.info}>Học kỳ: {course.semester}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={18} color="#6C63FF" />
          <Text style={styles.info}>Năm: {course.year}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="pricetag-outline" size={18} color="#6C63FF" />
          <Text style={styles.price}>{course.price.toLocaleString()} VNĐ</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="book-outline" size={18} color="#6C63FF" />
          <Text style={styles.info}>Số buổi: {course.numofperiods}</Text>
        </View>
      </View>

      {/* Thông tin môn học */}
      {subject && (
        <View style={styles.subjectBox}>
          <Text style={styles.subjectTitle}>Môn học: {subject.name}</Text>

          {/* ScrollView cho phần mô tả */}
          <ScrollView style={styles.subjectScroll}>
            <Text style={styles.subjectDesc}>
              {subject.description || "Không có mô tả."}
            </Text>
          </ScrollView>
        </View>
      )}

      {/* Nút chức năng */}
      <TouchableOpacity
        accessibilityLabel={`goScheduleList`}
        style={styles.button}
        onPress={() =>
          navigation.navigate("ScheduleList", { courseId: course.course_id })
        }
      >
        <Text style={styles.buttonText}>Xem Lịch Học</Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityLabel={`goLessonList`}
        style={styles.button}
        onPress={() =>
          navigation.navigate("LessonList", { courseId: course.course_id })
        }
      >
        <Text style={styles.buttonText}>Xem Bài Học</Text>
      </TouchableOpacity>
      {role === 3 && (
        <TouchableOpacity
          accessibilityLabel={`goStudentList`}
          style={[styles.button, { marginBottom: 20 }]}
          onPress={() =>
            navigation.navigate("TeacherStudentList", {
              courseId: course.course_id,
            })
          }
        >
          <Text style={styles.buttonText}>Danh Sách Sinh Viên</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  banner: { width: "100%", height: 170 },
  backButton: {
    position: "absolute",
    top: 20,
    left: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  infoBox: {
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  info: { fontSize: 16, color: "#444", marginLeft: 8 },
  price: { fontSize: 17, fontWeight: "bold", color: "#FF4D4F", marginLeft: 8 },

  // Style cho phần môn học
  subjectBox: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subjectDesc: {
    fontSize: 15,
    color: "#555",
    lineHeight: 20,
    maxWidth: 400,
  },
  subjectScroll: {
    maxHeight: 250,
  },
  button: {
    backgroundColor: "#6C63FF",
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});