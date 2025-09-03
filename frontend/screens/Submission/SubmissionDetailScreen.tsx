import React from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Linking,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import style chung
import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { imageStyles } from "../../constants/imageStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { cardStyles } from "../../constants/cardStyles";

//assets
import { Images } from "../../constants/images/images";
import { colors } from "../../constants/colors";
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SubmissionDetail"
>;

export default function SubmissionDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { submission } = route.params;

  const handleOpenDriveLink = () => {
    if (submission.drive_link) {
      Linking.openURL(submission.drive_link).catch(() =>
        Alert.alert("Lỗi", "Không thể mở link Google Drive.")
      );
    } else {
      Alert.alert("Thông báo", "Không có link bài nộp.");
    }
  };

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return "Chưa có";
    const d = new Date(dateTime);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
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
          <Text style={[textStyles.bannerTitle, { color: colors.textDark }]}>
            Chi tiết bài nộp
          </Text>
          <Text style={[textStyles.bannerSubtitle, { color: colors.textDark }]}>
            Thông tin và nội dung bài làm
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
      <Text
        style={[
          textStyles.listTitle,
          { marginTop: 10, marginLeft: 20, marginBottom: 0 },
        ]}
      >
        Chi tiết bài nộp
      </Text>
      {/* Nội dung bài nộp */}
      <View style={[cardStyles.card, { margin: 15 }]}>
        <Text style={[textStyles.subjectName, { fontSize: 18 }]}>
          Tên học sinh: {submission.student_name || "Không rõ"}
        </Text>
        <Text style={[textStyles.subjectDesc, { fontSize: 16 }]}>
          Nộp lúc: {formatDateTime(submission.submitted_at)}
        </Text>
        <Text style={[textStyles.subjectDesc, { fontSize: 16 }]}>
          Điểm: {submission.score != null ? submission.score : "Chưa chấm"}
        </Text>
        <Text style={[textStyles.subjectDesc, { fontSize: 16 }]}>
          Đánh giá: {submission.feedback || "Chưa nhận xét"}
        </Text>

        <Text style={[textStyles.subjectDesc, { marginTop: 10, fontSize: 16 }]}>
          Nội dung bài làm:
        </Text>
        <Text style={[textStyles.modalDesc, { fontSize: 16 }]}>
          {submission.content || "Không có nội dung"}
        </Text>
        {submission.drive_link && (
          <Text
            style={[textStyles.linkText, { color: "blue", fontSize: 16 }]}
            onPress={handleOpenDriveLink}
          >
            Link bài nộp (Google Drive)
          </Text>
        )}

        {/* Nút chấm điểm */}
        <TouchableOpacity
          accessibilityLabel={`goGradeSubmission`}
          style={[buttonStyles.primary, { marginTop: 15 }]}
          onPress={() =>
            navigation.navigate("GradeSubmissionScreen", { submission })
          }
        >
          <Text style={[buttonStyles.primaryText, { fontSize: 16 }]}>
            Chấm điểm
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Image
          source={Images.More.img11}
          style={imageStyles.footerImage}
          resizeMode="contain"
        />
        <Text style={textStyles.footerText}>
          Đánh giá bài làm để hỗ trợ sinh viên tốt hơn!
        </Text>
      </View>
    </ScrollView>
  );
}