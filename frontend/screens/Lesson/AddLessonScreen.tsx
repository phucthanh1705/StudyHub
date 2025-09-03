import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LessonService } from "../../services/lesson.service";
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

export default function AddLessonScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { courseId } = route.params;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pdfFile, setPdfFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [roleId, setRoleId] = useState<number | null>(null);

  // Lấy role khi mở màn
  const fetchRole = async () => {
    try {
      const user = await AuthService.getMe();
      setRoleId(user.role_id);
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.message || "Không lấy được thông tin người dùng."
      );
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  // Chọn file PDF
  const pickPdfFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        Alert.alert("Thông báo", "Bạn đã hủy chọn file PDF.");
        return;
      }

      const file = result.assets[0];
      setPdfFile({
        uri: file.uri,
        name: file.name || "document.pdf",
        type: file.mimeType || "application/pdf",
      });
    } catch (error) {
      console.error("Lỗi chọn file PDF:", error);
      Alert.alert("Lỗi", "Không thể chọn file PDF.");
    }
  };

  // Thêm bài học
  const handleAddLesson = async () => {
    if (roleId !== 1 && roleId !== 3) {
      Alert.alert("Thông báo", "Bạn không có quyền thêm bài học.");
      return;
    }

    if (!title || !content) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ tiêu đề và nội dung.");
      return;
    }

    if (!pdfFile) {
      Alert.alert("Thông báo", "Vui lòng chọn file PDF cho bài học.");
      return;
    }

    setLoading(true);
    try {
      const newLesson = await LessonService.createLesson({
        title,
        content,
        course_id: courseId,
        file: pdfFile,
      });

      Alert.alert("Thành công", `Đã thêm bài học: ${newLesson.title}`);
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể thêm bài học.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.lesson}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={[layoutStyles.bannerTextContainer, { left: "50%" }]}>
          <Text style={[textStyles.bannerTitle, { color: colors.background }]}>
            Thêm Bài Học
          </Text>
          <Text
            style={[textStyles.bannerSubtitle, { color: colors.background }]}
          >
            Tạo bài học mới cho khóa học
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
      <Text style={textStyles.listTitle}>Thêm bài học </Text>
      <View style={{ padding: 20 }}>
        <TextInput
          placeholder="Tiêu đề bài học"
          style={inputStyles.input}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          placeholder="Nội dung chi tiết"
          style={[inputStyles.input, { height: 100 }]}
          value={content}
          onChangeText={setContent}
          multiline
        />

        <TouchableOpacity
          accessibilityLabel={`pickPDFFile`}
          style={buttonStyles.primary}
          onPress={pickPdfFile}
        >
          <Text style={buttonStyles.primaryText}>Chọn file PDF</Text>
        </TouchableOpacity>
        {pdfFile && (
          <Text style={[textStyles.subjectDesc, { marginTop: 10 }]}>
            Đã chọn: {pdfFile.name}
          </Text>
        )}

        <TouchableOpacity
          accessibilityLabel={`addLesson`}
          style={[buttonStyles.primary, { marginTop: 15 }]}
          onPress={handleAddLesson}
          disabled={loading}
        >
          <Text style={buttonStyles.primaryText}>
            {loading ? "Đang thêm..." : "Thêm bài học"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Image
          source={Images.More.img12}
          style={imageStyles.footerImage}
          resizeMode="contain"
        />
        <Text style={textStyles.footerText}>
          Tiếp tục xây dựng kiến thức cho khóa học của bạn!
        </Text>
      </View>
    </ScrollView>
  );
}