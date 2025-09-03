import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SubjectService } from "../../services/subject.service";

// Import style constants
import { imageStyles } from "../../constants/imageStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { inputStyles } from "../../constants/inputStyles";
import { textStyles } from "../../constants/textStyles";
import { layoutStyles } from "../../constants/layoutStyles";
import { colors } from "../../constants/colors";

//assets
import { Images } from "../../constants/images/images";

export default function EditSubjectScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { id } = route.params;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const subject = await SubjectService.getById(id);
        setName(subject.name || "");
        setDescription(subject.description || "");
      } catch (error: any) {
        Alert.alert("Lỗi", error.message || "Không thể tải thông tin môn học.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleEdit = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ Tên môn học và Mô tả.");
      return;
    }

    setSaving(true);
    try {
      await SubjectService.update(id, { name, description });
      Alert.alert("Thành công", "Môn học đã được cập nhật thành công!");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Cập nhật môn học thất bại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải thông tin môn học...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={layoutStyles.scrollContainer}>
      {/* Banner */}
      <View>
        <Image
          source={Images.TopBanner.subject}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={textStyles.pageTitle}>Sửa Môn Học</Text>

      <View style={inputStyles.formContainer}>
        <Text style={inputStyles.inputTitle}>Tên môn học</Text>
        <TextInput
          placeholder="Tên môn học"
          style={inputStyles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={inputStyles.inputTitle}>Mô tả môn học</Text>
        <TextInput
          placeholder="Mô tả môn học"
          style={[inputStyles.input, inputStyles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        {saving ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <TouchableOpacity
            style={buttonStyles.primaryButton}
            onPress={handleEdit}
          >
            <Ionicons name="save-outline" size={20} color="#fff" />
            <Text style={buttonStyles.primaryButtonText}>Lưu</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={layoutStyles.bottomImageContainer}>
        <Image
          source={Images.More.img8}
          style={imageStyles.bottomImage}
          resizeMode="contain"
        />
      </View>
    </ScrollView>
  );
}