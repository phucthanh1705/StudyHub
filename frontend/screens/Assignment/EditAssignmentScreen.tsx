import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AssignmentService } from "../../services/assignment.service";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import styles chung
import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { inputStyles } from "../../constants/inputStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { imageStyles } from "../../constants/imageStyles";
import { colors } from "../../constants/colors";

//assets
import { Images } from "../../constants/images/images";

export default function EditAssignmentScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { assignmentId } = route.params || {};

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDuePicker, setShowDuePicker] = useState(false);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const fetchAssignment = async () => {
    setLoading(true);
    try {
      const data = await AssignmentService.getAssignmentById(assignmentId);
      setTitle(data.title || "");
      setDescription(data.description || "");
      setStartDate(
        data.due_date_start ? new Date(data.due_date_start) : new Date()
      );
      setDueDate(data.due_date_end ? new Date(data.due_date_end) : new Date());
      setLink(data.link_drive || "");
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải dữ liệu bài tập.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) fetchAssignment();
    else {
      Alert.alert("Lỗi", "Không tìm thấy ID bài tập.");
      navigation.goBack();
    }
  }, [assignmentId]);

  const handleSave = async () => {
    if (!title || !description || !startDate || !dueDate) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      await AssignmentService.updateAssignment(assignmentId, {
        title: title.trim(),
        description: description.trim(),
        due_date_start: formatDate(startDate),
        due_date_end: formatDate(dueDate),
        link_drive: link?.trim() || undefined,
      });

      Alert.alert("Thành công", "Cập nhật bài tập thành công.");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể cập nhật bài tập.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.assignment}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View
          style={[
            layoutStyles.bannerTextContainer,
            { left: "50%", maxWidth: 150 },
          ]}
        >
          <Text style={[textStyles.bannerTitle, { color: colors.primary }]}>
            Chỉnh sửa bài tập
          </Text>
          <Text
            style={[
              textStyles.bannerSubtitle,
              { color: colors.primary, marginTop: 10 },
            ]}
          >
            Cập nhật thông tin bài tập
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
      <Text style={textStyles.listTitle}>Chỉnh sửa bài tập </Text>
      {/* Form nhập liệu */}
      <View style={{ padding: 20 }}>
        <TextInput
          placeholder="Tiêu đề bài tập"
          style={inputStyles.input}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Mô tả bài tập"
          style={[inputStyles.input, { height: 80, textAlignVertical: "top" }]}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Date Picker Start */}
        <TouchableOpacity
          style={buttonStyles.dateInput}
          onPress={() => setShowStartPicker(true)}
        >
          <Text>Ngày bắt đầu: {formatDate(startDate)}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartPicker(Platform.OS === "ios");
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        )}

        {/* Date Picker Due */}
        <TouchableOpacity
          style={buttonStyles.dateInput}
          onPress={() => setShowDuePicker(true)}
        >
          <Text>Hạn nộp: {formatDate(dueDate)}</Text>
        </TouchableOpacity>
        {showDuePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDuePicker(Platform.OS === "ios");
              if (selectedDate) setDueDate(selectedDate);
            }}
          />
        )}

        <TextInput
          placeholder="Link nộp bài (Google Drive)"
          style={inputStyles.input}
          value={link}
          onChangeText={setLink}
        />

        <TouchableOpacity
          accessibilityLabel={`saveEditAssignment`}
          style={buttonStyles.primary}
          onPress={handleSave}
        >
          <Text style={buttonStyles.primaryText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Image
          source={Images.More.img7}
          style={imageStyles.footerImage}
          resizeMode="contain"
        />
        <Text style={textStyles.footerText}>
          Hoàn thiện bài tập giúp bạn tiến bộ hơn!
        </Text>
      </View>
    </ScrollView>
  );
}