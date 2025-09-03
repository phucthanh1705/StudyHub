import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { SubmissionService } from "../../services/submission.service";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import style chung
import { colors } from "../../constants/colors";
import { textStyles } from "../../constants/textStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { cardStyles } from "../../constants/cardStyles";
import { imageStyles } from "../../constants/imageStyles";
import { layoutStyles } from "../../constants/layoutStyles";

//assets
import { Images } from "../../constants/images/images";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SubmittedAssignments"
>;

export interface Submission {
  submission_id: number;
  assignment_title: string;
  submitted_at: string;
  score: number | null;
  feedback: string | null;
}

export default function SubmittedAssignmentsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await SubmissionService.getSubmissionsByUser();
      setSubmissions(data || []);
    } catch (err: any) {
      console.error("[SubmittedAssignmentsScreen] Error:", err);
      Alert.alert("Lỗi", err.message || "Không thể tải danh sách bài nộp.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa có";
    const d = new Date(dateString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải danh sách bài đã nộp...</Text>
      </View>
    );
  }

  return (
    <View style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.submission}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={[layoutStyles.bannerTextContainer, { left: 20 }]}>
          <Text style={textStyles.bannerTitle}>Bài tập đã nộp</Text>
          <Text style={textStyles.bannerSubtitle}>
            Xem tất cả bài tập bạn đã nộp
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
        Danh sách bài nộp
      </Text>
      {/* Danh sách */}
      {submissions.length === 0 ? (
        <View style={layoutStyles.center}>
          <Image
            source={Images.Common.nothing}
            style={imageStyles.emptyImage}
            resizeMode="contain"
          />
          <Text style={textStyles.emptyText}>Bạn chưa nộp bài tập nào.</Text>
        </View>
      ) : (
        <FlatList
          data={submissions}
          keyExtractor={(item) => item.submission_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              accessibilityLabel={`goSubmittedAssignmentDetail`}
              style={cardStyles.card}
              onPress={() =>
                navigation.navigate("SubmittedAssignmentDetail", {
                  submission: item,
                })
              }
            >
              <View style={{ flex: 1 }}>
                <Text style={textStyles.subjectName}>
                  {item.assignment_title || "Không có tiêu đề"}
                </Text>
                <Text style={textStyles.subjectDesc}>
                  Nộp lúc: {formatDate(item.submitted_at)}
                </Text>
                <Text style={textStyles.subjectDesc}>
                  Điểm: {item.score !== null ? item.score : "Chưa chấm"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <Image
                source={Images.More.img4}
                style={imageStyles.footerImage}
                resizeMode="contain"
              />
              <Text style={textStyles.footerText}>
                Hãy tiếp tục hoàn thành các bài tập sắp tới!
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}