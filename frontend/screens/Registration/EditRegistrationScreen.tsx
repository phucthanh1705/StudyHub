import React, { useState } from "react";
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

export default function EditRegistrationScreen() {
  const navigation = useNavigation();

  // Dữ liệu ảo (mock data)
  const [beginRegister, setBeginRegister] = useState("2025-08-01");
  const [endRegister, setEndRegister] = useState("2025-08-15");
  const [dueStart, setDueStart] = useState("2025-08-20");
  const [dueEnd, setDueEnd] = useState("2025-09-01");

  // Hàm xử lý cập nhật
  const handleSave = async () => {
    if (!beginRegister || !endRegister || !dueStart || !dueEnd) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      Alert.alert(
        "Thành công",
        `Cập nhật thời gian từ ${beginRegister} đến ${endRegister}`
      );
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể cập nhật thời gian.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sửa thời gian đăng ký</Text>

      <Text style={styles.label}>Ngày bắt đầu đăng ký</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        style={styles.input}
        value={beginRegister}
        onChangeText={setBeginRegister}
      />

      <Text style={styles.label}>Ngày kết thúc đăng ký</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        style={styles.input}
        value={endRegister}
        onChangeText={setEndRegister}
      />

      <Text style={styles.label}>Ngày bắt đầu đóng học phí</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        style={styles.input}
        value={dueStart}
        onChangeText={setDueStart}
        editable={false}
      />

      <Text style={styles.label}>Ngày kết thúc đóng học phí</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        style={styles.input}
        value={dueEnd}
        onChangeText={setDueEnd}
        editable={false}
      />

      <Button title="Lưu thay đổi" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { fontSize: 16, marginBottom: 5, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});