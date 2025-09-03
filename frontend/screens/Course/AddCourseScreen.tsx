import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { UserService } from "../../services/user.service";
import { CourseService } from "../../services/course.service";
import { SubjectService } from "../../services/subject.service";
import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { imageStyles } from "../../constants/imageStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { colors } from "../../constants/colors";
import { Images } from "../../constants/images/images";

import { getPdfUrl } from "../../src/config";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AddCourse"
>;

interface Teacher {
  user_id: number;
  name: string;
}

interface Subject {
  subject_id: number;
  name: string;
}

interface Schedule {
  date: string;
  start_time: string;
  end_time: string;
  room: string;
  note: string;
}

export default function AddCourseScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [numOfPeriods, setNumOfPeriods] = useState("");

  const [schedules, setSchedules] = useState<Schedule[]>([
    { date: "", start_time: "", end_time: "", room: "", note: "" },
  ]);

  const [showDatePicker, setShowDatePicker] = useState({
    index: -1,
    show: false,
  });
  const [showTimePicker, setShowTimePicker] = useState({
    index: -1,
    field: "start_time" as "start_time" | "end_time",
    show: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherData, subjectData] = await Promise.all([
          UserService.getAllTeachers(),
          SubjectService.getAll(),
        ]);
        setTeachers(teacherData);
        setSubjects(subjectData);
      } catch (error: any) {
        Alert.alert("Lỗi", error.message || "Không thể tải dữ liệu.");
      }
    };
    fetchData();
  }, []);

  const handleAddSchedule = () => {
    setSchedules([
      ...schedules,
      { date: "", start_time: "", end_time: "", room: "", note: "" },
    ]);
  };

  const updateScheduleField = (
    index: number,
    field: keyof Schedule,
    value: string
  ) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index][field] = value;
    setSchedules(updatedSchedules);
  };

  const formatTime24 = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleAdd = async () => {
    if (
      !selectedSubject ||
      !semester ||
      !year ||
      !price ||
      !numOfPeriods ||
      !selectedTeacher
    ) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // Kiểm tra thời gian hợp lệ
    const now = new Date();
    for (const sch of schedules) {
      if (!sch.date || !sch.start_time || !sch.end_time) {
        Alert.alert("Thông báo", "Vui lòng chọn đầy đủ ngày giờ học");
        return;
      }

      // Tạo Date object cho ngày học
      const [year, month, day] = sch.date.split("-").map(Number);
      const startTime = new Date(`${sch.date}T${sch.start_time}`);
      const endTime = new Date(`${sch.date}T${sch.end_time}`);
      const scheduleDate = new Date(year, month - 1, day);

      // Kiểm tra ngày trong quá khứ
      if (
        scheduleDate <
        new Date(now.getFullYear(), now.getMonth(), now.getDate())
      ) {
        Alert.alert("Lỗi", "Ngày học không được ở quá khứ");
        return;
      }

      // Nếu là hôm nay, kiểm tra giờ bắt đầu
      const todayStr = now.toISOString().split("T")[0];
      if (sch.date === todayStr && startTime <= now) {
        Alert.alert("Lỗi", "Giờ bắt đầu phải sau thời gian hiện tại");
        return;
      }

      // Kiểm tra giờ kết thúc > giờ bắt đầu
      if (endTime <= startTime) {
        Alert.alert("Lỗi", "Giờ kết thúc phải lớn hơn giờ bắt đầu");
        return;
      }
    }

    try {
      const courseData = {
        subject_id: Number(selectedSubject),
        user_id: Number(selectedTeacher),
        semester,
        year: Number(year),
        price: Number(price),
        numofperiods: Number(numOfPeriods),
        schedules,
      };

      await CourseService.create(courseData);
      Alert.alert("Thành công", "Tạo khóa học thành công!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tạo khóa học");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Banner */}
      <View>
        <Image
          source={Images.TopBanner.course}
          style={styles.banner}
          resizeMode="cover"
        />
        <View style={[layoutStyles.bannerTextContainer, { left: "50%" }]}>
          <Text style={[textStyles.bannerTitle, { color: colors.primary }]}>
            Thêm Khóa Học
          </Text>
          <Text style={[textStyles.bannerSubtitle, { color: colors.primary }]}>
            Thêm khóa học khóa học mới
          </Text>
        </View>
        <TouchableOpacity
          accessibilityLabel={`back`}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.pageTitle}>Thêm Khóa Học</Text>

      <View style={styles.formContainer}>
        {/* Subject */}
        <Text style={styles.label}>Môn Học</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            testID="subjectPicker"
            selectedValue={selectedSubject}
            onValueChange={(value) => setSelectedSubject(value)}
          >
            <Picker.Item label="-- Chọn môn học --" value="" />
            {subjects.map((sub) => (
              <Picker.Item
                key={sub.subject_id}
                label={sub.name}
                value={sub.subject_id.toString()}
              />
            ))}
          </Picker>
        </View>

        {/* Semester */}
        <Text style={styles.label}>Học Kỳ</Text>
        <TextInput
          placeholder="VD: HK1"
          style={styles.input}
          value={semester}
          onChangeText={setSemester}
        />

        {/* Year */}
        <Text style={styles.label}>Năm học</Text>
        <TextInput
          placeholder="VD: 2025"
          style={styles.input}
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />

        {/* Price */}
        <Text style={styles.label}>Giá Khóa Học (VNĐ)</Text>
        <TextInput
          placeholder="VD: 1000000"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        {/* Number of Periods */}
        <Text style={styles.label}>Số Tiết Học</Text>
        <TextInput
          placeholder="VD: 12"
          style={styles.input}
          value={numOfPeriods}
          onChangeText={setNumOfPeriods}
          keyboardType="numeric"
        />

        {/* Teacher */}
        <Text style={styles.label}>Giảng Viên</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            testID="teacherPicker"
            selectedValue={selectedTeacher}
            onValueChange={(value) => setSelectedTeacher(value)}
          >
            <Picker.Item label="-- Chọn giảng viên --" value="" />
            {teachers.map((teacher) => (
              <Picker.Item
                key={teacher.user_id}
                label={teacher.name}
                value={teacher.user_id.toString()}
              />
            ))}
          </Picker>
        </View>

        {/* Schedule List */}
        <Text style={styles.titleSchedule}>Danh Sách Lịch Học</Text>
        {schedules.map((sch, idx) => (
          <View key={idx} style={styles.scheduleBlock}>
            <Text style={styles.label}>Ngày Học</Text>
            <TouchableOpacity
              style={styles.datePickerBtn}
              onPress={() => setShowDatePicker({ index: idx, show: true })}
            >
              <Text>{sch.date || "Chọn Ngày Học"}</Text>
            </TouchableOpacity>
            {showDatePicker.show && showDatePicker.index === idx && (
              <DateTimePicker
                mode="date"
                value={sch.date ? new Date(sch.date) : new Date()}
                onChange={(e, date) => {
                  setShowDatePicker({ index: -1, show: false });
                  if (date)
                    updateScheduleField(
                      idx,
                      "date",
                      date.toISOString().split("T")[0]
                    );
                }}
              />
            )}

            <Text style={styles.label}>Giờ Bắt Đầu</Text>
            <TouchableOpacity
              style={styles.datePickerBtn}
              onPress={() =>
                setShowTimePicker({
                  index: idx,
                  field: "start_time",
                  show: true,
                })
              }
            >
              <Text>{sch.start_time || "Chọn Giờ Bắt Đầu"}</Text>
            </TouchableOpacity>
            {showTimePicker.show &&
              showTimePicker.index === idx &&
              showTimePicker.field === "start_time" && (
                <DateTimePicker
                  mode="time"
                  is24Hour
                  value={new Date()}
                  onChange={(e, date) => {
                    setShowTimePicker({
                      index: -1,
                      field: "start_time",
                      show: false,
                    });
                    if (date)
                      updateScheduleField(
                        idx,
                        "start_time",
                        formatTime24(date)
                      );
                  }}
                />
              )}

            <Text style={styles.label}>Giờ Kết Thúc</Text>
            <TouchableOpacity
              style={styles.datePickerBtn}
              onPress={() =>
                setShowTimePicker({ index: idx, field: "end_time", show: true })
              }
            >
              <Text>{sch.end_time || "Chọn Giờ Kết Thúc"}</Text>
            </TouchableOpacity>
            {showTimePicker.show &&
              showTimePicker.index === idx &&
              showTimePicker.field === "end_time" && (
                <DateTimePicker
                  mode="time"
                  is24Hour
                  value={new Date()}
                  onChange={(e, date) => {
                    setShowTimePicker({
                      index: -1,
                      field: "end_time",
                      show: false,
                    });
                    if (date)
                      updateScheduleField(idx, "end_time", formatTime24(date));
                  }}
                />
              )}

            <Text style={styles.label}>Phòng Học</Text>
            <TextInput
              placeholder="Phòng học"
              style={styles.input}
              value={sch.room}
              onChangeText={(val) => updateScheduleField(idx, "room", val)}
            />

            <Text style={styles.label}>Ghi Chú</Text>
            <TextInput
              placeholder="Ghi chú"
              style={styles.input}
              value={sch.note}
              onChangeText={(val) => updateScheduleField(idx, "note", val)}
            />
          </View>
        ))}

        <TouchableOpacity
          accessibilityLabel={`addScheduleTable`}
          style={styles.addScheduleBtn}
          onPress={handleAddSchedule}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addScheduleText}>Thêm Lịch Học</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel={`addCourse`}
          style={styles.submitBtn}
          onPress={handleAdd}
        >
          <Text style={styles.submitText}>Tạo Khóa Học</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: "#fff", paddingBottom: 20 },
  banner: { width: "100%", height: 180 },
  backButton: {
    position: "absolute",
    top: 19,
    left: 15,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 4,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  formContainer: { paddingHorizontal: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 6, color: "#444" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  titleSchedule: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#333",
  },
  scheduleBlock: {
    backgroundColor: "#f7f7f7",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  datePickerBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  addScheduleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  addScheduleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: "#6C63FF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});