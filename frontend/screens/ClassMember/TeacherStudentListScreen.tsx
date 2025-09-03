import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ClassMemberService } from "../../services/classmember.service";

// Import style chung
import { colors } from "../../constants/colors";
import { textStyles } from "../../constants/textStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { cardStyles } from "../../constants/cardStyles";
import { imageStyles } from "../../constants/imageStyles";
import { layoutStyles } from "../../constants/layoutStyles";

//assets
import { Images } from "../../constants/images/images";

interface StudentItem {
  user_id: number;
  name: string;
  email: string;
  status: string;
  tuition: number;
}

export default function TeacherStudentListScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { courseId } = route.params;
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(
    null
  );

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await ClassMemberService.getStudentsByCourse(courseId);
      setStudents(data);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải danh sách sinh viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [courseId]);

  const renderItem = ({ item }: { item: StudentItem }) => (
    <TouchableOpacity
      style={cardStyles.card}
      onPress={() => setSelectedStudent(item)}
      activeOpacity={0.9}
    >
      <View style={{ flex: 1 }}>
        <Text style={textStyles.subjectName}>{item.name}</Text>
        <Text style={textStyles.subjectDesc}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải danh sách sinh viên...</Text>
      </View>
    );
  }

  return (
    <View style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.teacherStudent}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View
          style={[
            layoutStyles.bannerTextContainer,
            { left: 40, maxWidth: 160 },
          ]}
        >
          <Text style={textStyles.bannerTitle}>Danh sách sinh viên</Text>
          <Text style={[textStyles.bannerSubtitle, { marginTop: 10 }]}>
            Quản lý danh sách sinh viên trong khóa học
          </Text>
        </View>
        <TouchableOpacity
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={textStyles.listTitle}>Danh sách sinh viên</Text>

      {students.length === 0 ? (
        <View style={layoutStyles.center}>
          <Image
            source={Images.Common.nothing}
            style={imageStyles.emptyImage}
            resizeMode="contain"
          />
          <Text style={textStyles.emptyText}>
            Không có sinh viên nào trong khóa học này.
          </Text>
        </View>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={renderItem}
          ListFooterComponent={
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <Image
                source={Images.More.img11}
                style={imageStyles.footerImage}
                resizeMode="contain"
              />
              <Text style={textStyles.footerText}>
                Tổng số sinh viên: {students.length}
              </Text>
            </View>
          }
        />
      )}

      {/* Modal xem chi tiết sinh viên */}
      {selectedStudent && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedStudent}
          onRequestClose={() => setSelectedStudent(null)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                width: "85%",
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 12,
                elevation: 5,
              }}
            >
              <Text style={textStyles.modalTitle}>{selectedStudent.name}</Text>
              <ScrollView>
                <Text style={textStyles.modalDesc}>
                  Email: {selectedStudent.email}
                </Text>
              </ScrollView>
              <TouchableOpacity
                style={buttonStyles.closeBtn}
                onPress={() => setSelectedStudent(null)}
              >
                <Text style={textStyles.closeBtnText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}