import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LessonService } from "../../services/lesson.service";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import style chung
import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { inputStyles } from "../../constants/inputStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { imageStyles } from "../../constants/imageStyles";
import { colors } from "../../constants/colors";

//assets
import { Images } from "../../constants/images/images";

export default function EditLessonScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { lessonId } = route.params;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentFile, setCurrentFile] = useState<string>("");
  const [newPdfFile, setNewPdfFile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const lesson = await LessonService.getLessonById(lessonId);
        setTitle(lesson.title || "");
        setContent(lesson.content || "");
        setCurrentFile(lesson.file || "");
      } catch (err: any) {
        Alert.alert("Lỗi", err.message || "Không thể tải thông tin bài học.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [lessonId]);

  // Chọn file PDF mới
  const pickPdfFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        Alert.alert("Thông báo", "Bạn đã hủy chọn file PDF.");
        return;
      }

      const file = result.assets?.[0];
      if (file) {
        setNewPdfFile({
          uri: file.uri,
          name: file.name || "document.pdf",
          type: file.mimeType || "application/pdf",
        });
      } else {
        Alert.alert("Thông báo", "Không tìm thấy file PDF.");
      }
    } catch (error) {
      console.error("Lỗi chọn file PDF:", error);
      Alert.alert("Lỗi", "Không thể chọn file PDF.");
    }
  };

  // Cập nhật bài học
  const handleUpdateLesson = async () => {
    if (!title || !content) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ tiêu đề và nội dung.");
      return;
    }

    setSaving(true);
    try {
      await LessonService.updateLesson(lessonId, {
        title,
        content,
        file: newPdfFile || undefined,
      });
      Alert.alert("Thành công", "Cập nhật bài học thành công.");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể cập nhật bài học.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải dữ liệu bài học...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={layoutStyles.container}>
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
            Chỉnh sửa bài học
          </Text>
          <Text
            style={[
              textStyles.bannerSubtitle,
              { color: colors.background, marginTop: 10 },
            ]}
          >
            Cập nhật thông tin và tài liệu bài học
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
      <Text style={textStyles.listTitle}>Chỉnh sửa bài học </Text>
      {/* Form chỉnh sửa */}
      <View style={{ padding: 20 }}>
        <TextInput
          placeholder="Tiêu đề bài học"
          style={inputStyles.input}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          placeholder="Nội dung chi tiết"
          style={[inputStyles.input, { height: 100, textAlignVertical: "top" }]}
          value={content}
          onChangeText={setContent}
          multiline
        />

        <Text style={[textStyles.subjectDesc, { marginBottom: 5 }]}>
          File PDF hiện tại:
        </Text>
        <Text style={{ fontSize: 14, color: colors.primary, marginBottom: 10 }}>
          {currentFile || "Chưa có file PDF"}
        </Text>

        <TouchableOpacity
          accessibilityLabel={`pickPDFFile`}
          style={buttonStyles.primary}
          onPress={pickPdfFile}
        >
          <Text style={buttonStyles.primaryText}>Chọn file PDF mới</Text>
        </TouchableOpacity>
        {newPdfFile && (
          <Text style={[textStyles.subjectDesc, { color: "green" }]}>
            Đã chọn: {newPdfFile.name}
          </Text>
        )}

        <TouchableOpacity
          accessibilityLabel={`updateLesson`}
          style={[buttonStyles.primary, { marginTop: 15 }]}
          onPress={handleUpdateLesson}
          disabled={saving}
        >
          <Text style={buttonStyles.primaryText}>
            {saving ? "Đang lưu..." : "Cập nhật bài học"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Image
          source={Images.More.img1}
          style={imageStyles.footerImage}
          resizeMode="contain"
        />
        <Text style={textStyles.footerText}>
          Hãy cập nhật đầy đủ để bài học trở nên hoàn thiện hơn!
        </Text>
      </View>
    </ScrollView>
  );
}