import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import { CourseScheduleService } from "../../services/courseschedule.service";
import { AuthService } from "../../services/auth.service";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import style chung
import { colors } from "../../constants/colors";
import { textStyles } from "../../constants/textStyles";
import { layoutStyles } from "../../constants/layoutStyles";
import { cardStyles } from "../../constants/cardStyles";
import { imageStyles } from "../../constants/imageStyles";
import { buttonStyles } from "../../constants/buttonStyles";

//assets
import { Images } from "../../constants/images/images";
interface Schedule {
  schedule_id: number;
  date: string;
  start_time: string;
  end_time: string;
  room: string;
  note: string;
  course_id: number;
  subject_name: string;
}

export default function ScheduleListScreen() {
  const route = useRoute<any>();
  const { courseId } = route.params;
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [roleId, setRoleId] = useState<number | null>(null);
  const isFocused = useIsFocused();

  const fetchRole = async () => {
    try {
      const me = await AuthService.getMe();
      setRoleId(me.role_id);
    } catch (error) {
      Alert.alert("Lỗi", "Không xác định được role người dùng");
    }
  };

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      let data: any;
      if (roleId === 1) {
        data = await CourseScheduleService.getAllAdmin();
        data = data.data.filter((sch: Schedule) => sch.course_id === courseId);
      } else if (roleId === 3) {
        data = await CourseScheduleService.getByTeacher();
        data = data.data.filter((sch: Schedule) => sch.course_id === courseId);
      } else if (roleId === 2) {
        data = await CourseScheduleService.getByStudent(courseId);
        data = data.data;
      } else {
        throw new Error("Không xác định quyền người dùng");
      }
      setSchedules(data);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải danh sách lịch học");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa lịch học này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await CourseScheduleService.delete(id);
            Alert.alert("Thành công", "Lịch học đã được xóa");
            fetchSchedules();
          } catch (error: any) {
            Alert.alert("Lỗi", error.message || "Xóa lịch học thất bại");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchRole();
  }, []);

  useEffect(() => {
    if (roleId !== null && isFocused) {
      fetchSchedules();
    }
  }, [roleId, isFocused]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text>Đang tải lịch học...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.schedule}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={layoutStyles.bannerTextContainer}>
          <Text style={[textStyles.bannerTitle, { color: colors.primary }]}>
            Lịch học
          </Text>
          <Text style={[textStyles.bannerSubtitle, { color: colors.primary }]}>
            Quản lý lịch học
          </Text>
        </View>
        <TouchableOpacity
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tiêu đề */}
      <Text style={[styles.title, { textAlign: "center" }]}>
        Danh Sách Lịch Học
      </Text>
      <Text style={styles.totalText}>Tổng số: {schedules.length} lịch học</Text>

      {/* Danh sách */}
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.schedule_id.toString()}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={16} color="#6C63FF" />
              <Text style={styles.cardText}>
                Ngày: {item.date.split("T")[0]}
              </Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="time-outline" size={16} color="#6C63FF" />
              <Text style={styles.cardText}>
                Giờ: {item.start_time} - {item.end_time}
              </Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="home-outline" size={16} color="#6C63FF" />
              <Text style={styles.cardText}>Phòng: {item.room}</Text>
            </View>
            {item.note ? (
              <View style={styles.row}>
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color="#6C63FF"
                />
                <Text style={styles.cardText}>Ghi chú: {item.note}</Text>
              </View>
            ) : null}

            {roleId === 1 && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#6C63FF" }]}
                  onPress={() =>
                    navigation.navigate("EditCourseSchedule", {
                      scheduleId: item.schedule_id,
                    })
                  }
                >
                  <Text style={styles.actionText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#FF4D4D" }]}
                  onPress={() => handleDelete(item.schedule_id)}
                >
                  <Text style={styles.actionText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        ListFooterComponent={() => (
          <View
            style={{
              marginTop: 20,
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <Image
              source={Images.More.img9}
              style={imageStyles.footerImage}
              resizeMode="contain"
            />
            <Text style={textStyles.footerText}>
              Lịch trình rõ ràng – Học tập dễ dàng, thành công vững vàng
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  banner: { width: "100%", height: 160, marginBottom: 10 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginBottom: 5,
    color: "#333",
  },
  totalText: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 15,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  cardText: { fontSize: 15, color: "#444", marginLeft: 8 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  actionText: { color: "#fff", fontWeight: "600" },
});