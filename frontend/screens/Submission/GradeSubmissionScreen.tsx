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
export default function GradeSubmissionScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { submission } = route.params;

  const [score, setScore] = useState(submission?.score?.toString() || "");
  const [feedback, setFeedback] = useState(submission?.feedback || "");
  const [loading, setLoading] = useState(false);

  const handleGrade = async () => {
    if (!score) {
      Alert.alert("Lỗi", "Vui lòng nhập điểm!");
      return;
    }

    const parsedScore = parseFloat(score);
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 10) {
      Alert.alert("Lỗi", "Điểm phải nằm trong khoảng 0 - 10.");
      return;
    }

    setLoading(true);
    try {
      await SubmissionService.gradeSubmission(submission.submission_id, {
        score: parsedScore,
        feedback: feedback.trim(),
      });

      Alert.alert(
        "Thành công",
        `Đã chấm điểm cho HS: ${submission.studentName}\nĐiểm: ${parsedScore}\nNhận xét: ${feedback || "Không có"}`
      );
      navigation.goBack();
    } catch (error: any) {
      console.error("[GradeSubmission] Error:", error);
      Alert.alert("Lỗi", error.message || "Không thể chấm điểm.");
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
          <Text style={[textStyles.bannerTitle, { color: colors.textDark }]}>
            Chấm điểm
          </Text>
          <Text style={[textStyles.bannerSubtitle, { color: colors.textDark }]}>
            Nhập điểm và nhận xét cho học sinh
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

      {/* Nội dung */}
      <View style={{ padding: 20 }}>
        <Text style={textStyles.listTitle}>Chấm điểm</Text>

        <TextInput
          placeholder="Nhập điểm (0 - 10)"
          style={inputStyles.input}
          keyboardType="numeric"
          value={score}
          onChangeText={setScore}
        />
        <TextInput
          placeholder="Nhận xét"
          style={[inputStyles.input, { height: 100 }]}
          value={feedback}
          onChangeText={setFeedback}
          multiline
        />

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <TouchableOpacity
            accessibilityLabel={`saveGrade`}
            style={[buttonStyles.primary, { marginTop: 10 }]}
            onPress={handleGrade}
          >
            <Text style={buttonStyles.primaryText}>Lưu điểm</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Footer */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Image
          source={Images.More.img10}
          style={imageStyles.footerImage}
          resizeMode="contain"
        />
        <Text style={textStyles.footerText}>
          Hãy đánh giá công bằng và khách quan!
        </Text>
      </View>
    </ScrollView>
  );
}