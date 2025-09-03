import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CourseScheduleService } from "../../services/courseschedule.service";
// Import styles
import { colors } from "../../constants/colors";
import { textStyles } from "../../constants/textStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { cardStyles } from "../../constants/cardStyles";
import { imageStyles } from "../../constants/imageStyles";
import { layoutStyles } from "../../constants/layoutStyles";
import { searchStyles } from "../../constants/searchStyles";

//assets
import { Images } from "../../constants/images/images";
interface Schedule {
  schedule_id: number;
  date: string;
  start_time: string;
  end_time: string;
  room: string;
  note?: string;
  course_id: number;
}

export default function EditCourseScheduleScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { scheduleId } = route.params;

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  // State hiển thị Date/Time Picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Lấy lịch học theo ID
  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await CourseScheduleService.getByIdAdmin(scheduleId);
      const sch = res.data;
      sch.date = sch.date.split("T")[0];
      setSchedules([sch]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải lịch học");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [scheduleId]);

  // Hàm thay đổi dữ liệu
  const handleChange = (
    index: number,
    field: keyof Schedule,
    value: string
  ) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    setSchedules(updated);
  };

  // Hàm lưu lịch học
  const handleSaveOne = async (schedule: Schedule) => {
    try {
      if (
        !schedule.date ||
        !schedule.start_time ||
        !schedule.end_time ||
        !schedule.room
      ) {
        Alert.alert(
          "Thông báo",
          `Vui lòng nhập đầy đủ thông tin cho lịch ID ${schedule.schedule_id}`
        );
        return;
      }
      await CourseScheduleService.update(schedule.schedule_id, {
        room: schedule.room,
        date: schedule.date,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        note: schedule.note || "",
        course_id: schedule.course_id,
      });
      Alert.alert(
        "Thành công",
        `Cập nhật lịch ID ${schedule.schedule_id} thành công!`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể cập nhật lịch học");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text>Đang tải dữ liệu lịch học...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <View>
        <Image
          source={Images.TopBanner.schedule}
          style={styles.banner}
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
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Chỉnh Sửa Lịch Học</Text>

      {schedules.map((schedule, index) => (
        <View key={schedule.schedule_id} style={styles.scheduleBlock}>
          <Text style={styles.scheduleTitle}>Lịch #{index + 1}</Text>

          {/* Ngày học */}
          <Text style={styles.label}>Ngày học</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              setActiveIndex(index);
              setShowDatePicker(true);
            }}
          >
            <Text>{schedule.date || "Chọn ngày"}</Text>
          </TouchableOpacity>

          {/* Giờ bắt đầu */}
          <Text style={styles.label}>Giờ bắt đầu</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              setActiveIndex(index);
              setShowStartTimePicker(true);
            }}
          >
            <Text>{schedule.start_time || "Chọn giờ bắt đầu"}</Text>
          </TouchableOpacity>

          {/* Giờ kết thúc */}
          <Text style={styles.label}>Giờ kết thúc</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              setActiveIndex(index);
              setShowEndTimePicker(true);
            }}
          >
            <Text>{schedule.end_time || "Chọn giờ kết thúc"}</Text>
          </TouchableOpacity>

          {/* Phòng học */}
          <Text style={styles.label}>Phòng học</Text>
          <TextInput
            style={styles.input}
            value={schedule.room}
            onChangeText={(text) => handleChange(index, "room", text)}
          />

          {/* Ghi chú */}
          <Text style={styles.label}>Ghi chú</Text>
          <TextInput
            style={styles.input}
            value={schedule.note || ""}
            onChangeText={(text) => handleChange(index, "note", text)}
          />

          {/* Nút lưu */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleSaveOne(schedule)}
          >
            <Ionicons name="save-outline" size={18} color="#fff" />
            <Text style={styles.saveButtonText}>Lưu Lịch Này</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Date Picker */}
      {showDatePicker && activeIndex !== null && (
        <DateTimePicker
          value={
            schedules[activeIndex].date
              ? new Date(schedules[activeIndex].date)
              : new Date()
          }
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const dateStr = selectedDate.toISOString().split("T")[0];
              handleChange(activeIndex, "date", dateStr);
            }
          }}
        />
      )}

      {/* Start Time Picker */}
      {showStartTimePicker && activeIndex !== null && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedTime) => {
            setShowStartTimePicker(false);
            if (selectedTime) {
              const timeStr = selectedTime
                .toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                .slice(0, 5);
              handleChange(activeIndex, "start_time", timeStr);
            }
          }}
        />
      )}

      {/* End Time Picker */}
      {showEndTimePicker && activeIndex !== null && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedTime) => {
            setShowEndTimePicker(false);
            if (selectedTime) {
              const timeStr = selectedTime
                .toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                .slice(0, 5);
              handleChange(activeIndex, "end_time", timeStr);
            }
          }}
        />
      )}
      {/* Footer */}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  banner: { width: "100%", height: 180 },
  backButton: {
    position: "absolute",
    top: 19,
    left: 15,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#333",
  },
  scheduleBlock: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 5, color: "#555" },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6C63FF",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5,
  },
});