import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RegisterCourseService } from "../../services/registercourse.service";

//assets
import { Images } from "../../constants/images/images";

export default function AddRegistrationScreen() {
  const navigation = useNavigation();
  const [beginRegister, setBeginRegister] = useState("");
  const [endRegister, setEndRegister] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  const [dueStart, setDueStart] = useState("");
  const [dueEnd, setDueEnd] = useState("");

  // Hàm tính ngày học phí tự động
  useEffect(() => {
    if (endRegister) {
      try {
        const endDate = new Date(endRegister);
        if (!isNaN(endDate.getTime())) {
          const start = new Date(endDate);
          start.setDate(start.getDate() + 1);

          const end = new Date(start);
          end.setDate(end.getDate() + 20);

          setDueStart(start.toISOString().split("T")[0]);
          setDueEnd(end.toISOString().split("T")[0]);
        }
      } catch (err) {
        console.error("Error calculating due dates:", err);
      }
    }
  }, [endRegister]);

  const handleAdd = async () => {
    if (!beginRegister || !endRegister || !year || !semester) {
      Alert.alert("Thông báo", "Vui lòng nhập đủ thông tin.");
      return;
    }

    try {
      const data = {
        begin_register: beginRegister,
        end_register: endRegister,
        year: parseInt(year),
        semester: parseInt(semester),
      };

      const result = await RegisterCourseService.createForAll(data);
      Alert.alert("Thành công", result.message || "Đã tạo đăng ký học phần.");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tạo đăng ký học phần.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tạo đăng ký học phần</Text>

      <TextInput
        placeholder="Năm học (VD: 2025)"
        style={styles.input}
        value={year}
        keyboardType="numeric"
        onChangeText={setYear}
      />
      <TextInput
        placeholder="Học kỳ (VD: 1)"
        style={styles.input}
        value={semester}
        keyboardType="numeric"
        onChangeText={setSemester}
      />
      <TextInput
        placeholder="Ngày bắt đầu đăng ký (YYYY-MM-DD)"
        style={styles.input}
        value={beginRegister}
        onChangeText={setBeginRegister}
      />
      <TextInput
        placeholder="Ngày kết thúc đăng ký (YYYY-MM-DD)"
        style={styles.input}
        value={endRegister}
        onChangeText={setEndRegister}
      />

      {/* Hiển thị tự động due_date_start và due_date_end */}
      <View style={styles.readOnlyBox}>
        <Text>Ngày bắt đầu đóng học phí: {dueStart || "--"}</Text>
        <Text>Ngày kết thúc đóng học phí: {dueEnd || "--"}</Text>
      </View>

      <Button title="Tạo đăng ký" onPress={handleAdd} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  readOnlyBox: {
    padding: 10,
    backgroundColor: "#f1f1f1",
    marginBottom: 15,
    borderRadius: 5,
  },
});