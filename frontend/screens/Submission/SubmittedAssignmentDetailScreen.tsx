import React from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Linking,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import CSS chung
import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { cardStyles } from "../../constants/cardStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { imageStyles } from "../../constants/imageStyles";
import { colors } from "../../constants/colors";

//assets
import { Images } from "../../constants/images/images";

interface Submission {
  submission_id: number;
  assignment_title: string;
  submitted_at: string;
  score: number | null;
  feedback: string | null;
  content?: string;
  drive_link?: string;
}

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SubmittedAssignmentDetail"
>;

export default function SubmittedAssignmentDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const submission: Submission | undefined = route.params?.submission;

  if (!submission) {
    return (
      <View style={layoutStyles.center}>
        <Text style={[textStyles.emptyText, { color: colors.danger }]}>
          Không có thông tin bài nộp.
        </Text>
        <TouchableOpacity
          accessibilityLabel={`backNothing`}
          style={[buttonStyles.primary, { marginTop: 15 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={buttonStyles.primaryText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleOpenDrive = () => {
    if (submission.drive_link) {
      Linking.openURL(submission.drive_link).catch(() =>
        Alert.alert("Lỗi", "Không thể mở link Google Drive.")
      );
    } else {
      Alert.alert("Thông báo", "Không có link bài nộp.");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa có";
    const d = new Date(dateString);
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
          <Text style={textStyles.bannerTitle}>Chi tiết bài nộp</Text>
          <Text style={textStyles.bannerSubtitle}>
            Xem thông tin đầy đủ về bài nộp
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
      {/* Nội dung chi tiết */}
      <View style={[cardStyles.card, { margin: 15 }]}>
        <Text style={textStyles.subjectName}>
          {submission.assignment_title || "Không có tiêu đề"}
        </Text>
        <Text style={textStyles.subjectDesc}>
          Nộp lúc: {formatDate(submission.submitted_at)}
        </Text>
        <Text style={textStyles.subjectDesc}>
          Điểm: {submission.score !== null ? submission.score : "Chưa chấm"}
        </Text>
        <Text style={textStyles.subjectDesc}>
          Đánh giá: {submission.feedback || "Chưa nhận xét"}
        </Text>

        <View
          style={{
            padding: 10,
            backgroundColor: "#f9f9f9",
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <Text style={[textStyles.subjectName, { fontSize: 16 }]}>
            Nội dung bài làm:
          </Text>
          <Text style={[textStyles.subjectDesc, { marginTop: 5 }]}>
            {submission.content?.trim()
              ? submission.content
              : "Không có nội dung"}
          </Text>
          {submission.drive_link && (
            <Text
              style={[
                textStyles.linkText,
                {
                  color: "blue",
                  textDecorationLine: "underline",
                  marginTop: 10,
                },
              ]}
              onPress={handleOpenDrive}
            >
              Mở bài nộp trên Google Drive
            </Text>
          )}
        </View>
      </View>

      {/* Footer */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Image
          source={Images.More.img1}
          style={imageStyles.footerImage}
          resizeMode="contain"
        />
        <Text style={textStyles.footerText}>
          Hãy xem kỹ đánh giá để cải thiện bài làm của bạn!
        </Text>
      </View>
    </ScrollView>
  );
}