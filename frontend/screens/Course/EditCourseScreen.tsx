import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { CourseService } from "../../services/course.service";
//assets
import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { imageStyles } from "../../constants/imageStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { colors } from "../../constants/colors";
import { Images } from "../../constants/images/images";

import { getPdfUrl } from "../../src/config";

export default function EditCourseScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { id } = route.params;

  const [subjectId, setSubjectId] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [numOfPeriods, setNumOfPeriods] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lấy dữ liệu khóa học khi mở màn hình
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await CourseService.getByIdAdmin(id);
        setSubjectId(String(data.subject_id || ""));
        setSemester(data.semester || "");
        setYear(String(data.year || ""));
        setPrice(String(data.price || ""));
        setNumOfPeriods(String(data.numofperiods || ""));
      } catch (error: any) {
        Alert.alert(
          "Lỗi",
          error.message || "Không thể tải thông tin khóa học."
        );
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  // Hàm lưu chỉnh sửa
  const handleEdit = async () => {
    if (!subjectId || !semester || !year || !price || !numOfPeriods) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setSaving(true);
    try {
      const data = {
        subject_id: Number(subjectId),
        semester,
        year: Number(year),
        price: Number(price),
        numofperiods: Number(numOfPeriods),
      };
      await CourseService.update(id, data);
      Alert.alert("Thành công", "Khóa học đã được cập nhật thành công!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Cập nhật khóa học thất bại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text>Đang tải dữ liệu khóa học...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Banner */}
      <View>
        <Image
          source={Images.TopBanner.course}
          style={styles.banner}
          resizeMode="cover"
        />
        <View style={[layoutStyles.bannerTextContainer, { left: "50%" }]}>
          <Text style={[textStyles.bannerTitle, { color: colors.primary }]}>
            Sửa Khóa Học
          </Text>
          <Text style={[textStyles.bannerSubtitle, { color: colors.primary }]}>
            Chỉnh sửa thông tin khóa học của bạn
          </Text>
        </View>
        {/* Nút quay lại */}
        <TouchableOpacity
          accessibilityLabel={`back`}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tiêu đề */}
      <Text style={styles.pageTitle}>Sửa Khóa Học</Text>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Môn học (ID)</Text>
        <TextInput
          placeholder="Mã môn học"
          style={styles.input}
          value={subjectId}
          onChangeText={setSubjectId}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Học kỳ</Text>
        <TextInput
          placeholder="VD: HK1"
          style={styles.input}
          value={semester}
          onChangeText={setSemester}
        />

        <Text style={styles.label}>Năm học</Text>
        <TextInput
          placeholder="VD: 2025"
          style={styles.input}
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Giá khóa học (VNĐ)</Text>
        <TextInput
          placeholder="VD: 1000000"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Số buổi học</Text>
        <TextInput
          placeholder="VD: 12"
          style={styles.input}
          value={numOfPeriods}
          onChangeText={setNumOfPeriods}
          keyboardType="numeric"
        />

        {/* Nút Lưu */}
        <TouchableOpacity
          accessibilityLabel={`saveCourse`}
          style={styles.saveBtn}
          onPress={handleEdit}
          disabled={saving}
        >
          <Text style={styles.saveText}>{saving ? "Đang lưu..." : "Lưu"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: "#fff", paddingBottom: 20 },
  banner: { width: "100%", height: 180 },
  backButton: {
    position: "absolute",
    top: 19,
    left: 15,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 4,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  formContainer: { paddingHorizontal: 20 },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fafafa",
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#6C63FF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});