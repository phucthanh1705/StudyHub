import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SubmissionService } from "../../services/submission.service";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import CSS chung
import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { inputStyles } from "../../constants/inputStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { imageStyles } from "../../constants/imageStyles";
import { colors } from "../../constants/colors";

//assets
import { Images } from "../../constants/images/images";

export default function SubmitAssignmentScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { assignment } = route.params;

  const [content, setContent] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content && !driveLink) {
      Alert.alert(
        "Thông báo",
        "Vui lòng nhập nội dung bài làm hoặc link Google Drive!"
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        assignment_id: assignment.assignment_id,
        content: content.trim() || undefined,
        drive_link: driveLink.trim() || undefined,
      };

      await SubmissionService.createSubmission(payload);

      Alert.alert("Thành công", `Đã nộp bài cho ${assignment.title}`);
      navigation.goBack();
    } catch (error: any) {
      console.error("[SubmitAssignment] Error:", error);
      Alert.alert("Lỗi", error.message || "Không thể nộp bài.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.submission}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={[layoutStyles.bannerTextContainer, { left: 20 }]}>
          <Text style={textStyles.bannerTitle}>Nộp bài tập</Text>
          <Text style={textStyles.bannerSubtitle}>
            Điền nội dung và link bài làm để nộp
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

      {/* Nội dung form */}
      <View style={{ padding: 20 }}>
        <Text style={textStyles.listTitle}>Bài tập: {assignment.title}</Text>

        <TextInput
          placeholder="Nhập nội dung bài làm..."
          style={[inputStyles.input, { height: 100 }]}
          value={content}
          onChangeText={setContent}
          multiline
        />

        <TextInput
          placeholder="Link bài làm (Google Drive)..."
          style={inputStyles.input}
          value={driveLink}
          onChangeText={setDriveLink}
        />

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <TouchableOpacity
            accessibilityLabel={`submissionAssignment`}
            style={[buttonStyles.primary, { marginTop: 10 }]}
            onPress={handleSubmit}
          >
            <Text style={buttonStyles.primaryText}>Nộp bài</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Footer */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Image
          source={Images.More.img12}
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