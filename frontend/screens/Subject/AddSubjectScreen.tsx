import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { SubjectService } from "../../services/subject.service";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import style constants
import { imageStyles } from "../../constants/imageStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { inputStyles } from "../../constants/inputStyles";
import { textStyles } from "../../constants/textStyles";
import { layoutStyles } from "../../constants/layoutStyles";

//assets
import { Images } from "../../constants/images/images";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AddSubject"
>;

export default function AddSubjectScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddSubject = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ tên và mô tả môn học.");
      return;
    }

    try {
      setLoading(true);
      await SubjectService.create({
        name: name.trim(),
        description: description.trim(),
      });
      Alert.alert("Thành công", "Môn học đã được tạo thành công!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tạo môn học.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={layoutStyles.scrollContainer}>
      {/* Banner */}
      <View>
        <Image
          source={Images.TopBanner.subject}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        {/* Nút quay lại */}
        <TouchableOpacity
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tiêu đề dưới banner */}
      <Text style={textStyles.pageTitle}>Thêm Môn Học</Text>

      {/* Form */}
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

        {loading ? (
          <ActivityIndicator size="large" color="#6C63FF" />
        ) : (
          <TouchableOpacity
            style={buttonStyles.primaryButton}
            onPress={handleAddSubject}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={buttonStyles.primaryButtonText}>Tạo môn học</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Ảnh minh họa dưới nút Tạo môn học */}
      <View style={layoutStyles.bottomImageContainer}>
        <Image
          source={Images.More.img5}
          style={imageStyles.bottomImage}
          resizeMode="contain"
        />
      </View>
    </ScrollView>
  );
}