import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AssignmentService } from "../../services/assignment.service";
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

export default function AddAssignmentScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { lessonId } = route.params;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkDrive, setLinkDrive] = useState("");
  const [dueDateStart, setDueDateStart] = useState<Date>(new Date());
  const [dueDateEnd, setDueDateEnd] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Hàm format ngày về dạng YYYY-MM-DD HH:mm:ss
  const formatDate = (date: Date, time: string = "00:00:00") => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day} ${time}`;
  };

  const handleAdd = async () => {
    if (!title || !description) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        lesson_id: lessonId,
        title: title.trim(),
        description: description.trim(),
        due_date_start: formatDate(dueDateStart, "00:00:00"),
        due_date_end: formatDate(dueDateEnd, "23:59:59"),
        ...(linkDrive.trim() && { link_drive: linkDrive.trim() }),
      };

      await AssignmentService.createAssignment(payload);

      Alert.alert("Thành công", `Đã thêm bài tập cho Lesson ${lessonId}`);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.response?.data?.error ||
          error.message ||
          "Không thể thêm bài tập."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.assignment}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={[layoutStyles.bannerTextContainer, { left: "50%" }]}>
          <Text style={[textStyles.bannerTitle, { color: colors.primary }]}>
            Thêm Bài Tập
          </Text>
          <Text style={[textStyles.bannerSubtitle, { color: colors.primary }]}>
            Thêm bài tập cho Lesson {lessonId}
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
      <Text style={[textStyles.title, { marginBottom: -10 }]}>
        Thêm bài tập mới
      </Text>
      {/* Form */}
      <View style={{ padding: 20 }}>
        <TextInput
          placeholder="Tiêu đề bài tập"
          style={inputStyles.input}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Mô tả bài tập"
          style={[inputStyles.input, { height: 80 }]}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Date Picker Start */}
        <TouchableOpacity
          style={buttonStyles.dateInput}
          onPress={() => setShowStartPicker(true)}
        >
          <Text>Ngày bắt đầu: {formatDate(dueDateStart).split(" ")[0]}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={dueDateStart}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartPicker(Platform.OS === "ios");
              if (selectedDate) setDueDateStart(selectedDate);
            }}
          />
        )}

        {/* Date Picker End */}
        <TouchableOpacity
          style={buttonStyles.dateInput}
          onPress={() => setShowEndPicker(true)}
        >
          <Text>Hạn nộp: {formatDate(dueDateEnd).split(" ")[0]}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={dueDateEnd}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndPicker(Platform.OS === "ios");
              if (selectedDate) setDueDateEnd(selectedDate);
            }}
          />
        )}

        <TextInput
          placeholder="Link bài tập (Google Drive)"
          style={inputStyles.input}
          value={linkDrive}
          onChangeText={setLinkDrive}
        />

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <TouchableOpacity
            accessibilityLabel={`addAssignment`}
            style={buttonStyles.primary}
            onPress={handleAdd}
          >
            <Text style={buttonStyles.primaryText}>Thêm bài tập</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Footer */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Image
          source={Images.More.img3}
          style={imageStyles.footerImage}
          resizeMode="contain"
        />
        <Text style={textStyles.footerText}>
          Hãy hoàn thành bài tập đúng hạn!
        </Text>
      </View>
    </ScrollView>
  );
}
