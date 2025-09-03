import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Platform,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RegisterCourseService } from "../../services/registercourse.service";

// Import styles chung
import { colors } from "../../constants/colors";
import { textStyles } from "../../constants/textStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { cardStyles } from "../../constants/cardStyles";
import { imageStyles } from "../../constants/imageStyles";
import { layoutStyles } from "../../constants/layoutStyles";
import { inputStyles } from "../../constants/inputStyles";
import { modalStyles } from "../../constants/modalStyles";

//assets
import { Images } from "../../constants/images/images";

interface RegisterTime {
  begin_register: string; 
  end_register: string;
  due_date_start: string;
  due_date_end: string;
  year: number;
  semester: number;
  begin_display?: string; 
  end_display?: string; 
}

export default function RegisterTimeScreen() {
  const navigation = useNavigation();
  const [registerTimes, setRegisterTimes] = useState<RegisterTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [role, setRole] = useState<number | null>(null);

  const [begin, setBegin] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  const [showBeginPicker, setShowBeginPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedTime, setSelectedTime] = useState<RegisterTime | null>(null);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  useEffect(() => {
    const fetchRole = async () => {
      const savedRole = await AsyncStorage.getItem("role_id");
      setRole(savedRole ? parseInt(savedRole, 10) : null);
    };
    fetchRole();
  }, []);

  const fetchRegisterTimes = async () => {
    try {
      setLoading(true);
      const data = await RegisterCourseService.getAll();

      // Không ghi đè ngày gốc từ DB, chỉ thêm ngày hiển thị
      const unique = data.reduce((acc: RegisterTime[], curr: RegisterTime) => {
        const formattedCurr: RegisterTime = {
          ...curr,
          begin_display: curr.begin_register.slice(0, 10),
          end_display: curr.end_register.slice(0, 10),
          due_date_start: curr.due_date_start.slice(0, 10),
          due_date_end: curr.due_date_end.slice(0, 10),
        };
        const exists = acc.find(
          (x) =>
            x.begin_display === formattedCurr.begin_display &&
            x.end_display === formattedCurr.end_display
        );
        if (!exists) acc.push(formattedCurr);
        return acc;
      }, []);

      setRegisterTimes(unique);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role !== null) fetchRegisterTimes();
  }, [role]);

  const openModal = (editData?: RegisterTime) => {
    if (editData) {
      // Dùng ngày hiển thị cho UI
      setBegin(new Date(editData.begin_display!));
      setEnd(new Date(editData.end_display!));
      setYear(editData.year.toString());
      setSemester(editData.semester.toString());
      setSelectedTime(editData); 
      setIsEditing(true);
    } else {
      setBegin(new Date());
      setEnd(new Date());
      setYear("");
      setSemester("");
      setIsEditing(false);
    }
    setModalVisible(true);
  };

  const saveRegisterTime = async () => {
    if (!year || !semester) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      if (isEditing && selectedTime) {
        const payload = {
          // Giữ nguyên ngày gốc từ DB để BE so sánh
          begin: formatDate(selectedTime.begin_register),
          end: formatDate(selectedTime.end_register),
          newBegin: formatDate(begin),
          newEnd: formatDate(end),
        };

        console.log("[SCREEN] Payload gửi service:", payload);

        await RegisterCourseService.updateRegisterTime(payload);
        Alert.alert("Thành công", "Cập nhật thời gian thành công");
      } else {
        const res = await RegisterCourseService.createForAll({
          begin_register: formatDate(begin),
          end_register: formatDate(end),
          year: Number(year),
          semester: Number(semester),
        });

        if (res?.message) {
          // Nếu BE trả về message thì hiển thị message đó
          if (res.message.includes("tồn tại")) {
            Alert.alert("Thông báo", res.message);
            setModalVisible(false);
            return; 
          } else {
            Alert.alert("Thành công", res.message);
          }
        } else {
          Alert.alert("Thành công", "Thêm thời gian đăng ký thành công");
        }
      }
      setModalVisible(false);
      fetchRegisterTimes();
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const renderTimeCard = ({ item }: { item: RegisterTime }) => (
    <View style={cardStyles.card}>
      <View style={{ flex: 1 }}>
        <Text style={textStyles.subjectName}>
          Học kỳ {item.semester} - {item.year}
        </Text>
        <Text style={textStyles.subjectDesc}>
          Bắt đầu: {item.begin_display}
        </Text>
        <Text style={textStyles.subjectDesc}>Kết thúc: {item.end_display}</Text>
        <Text style={textStyles.subjectDesc}>
          Đóng học phí: {item.due_date_start} - {item.due_date_end}
        </Text>
      </View>
      {role === 1 && !isExpired(item.end_display!) && (
        <TouchableOpacity
          style={[buttonStyles.smallBtn, { backgroundColor: colors.primary }]}
          onPress={() => openModal(item)}
        >
          <Text style={buttonStyles.smallBtnText}>Cập nhật</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.registerTime}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={[layoutStyles.bannerTextContainer, { left: "50%" }]}>
          <Text style={[textStyles.bannerTitle, { maxWidth: 150 }]}>
            Thời gian đăng ký
          </Text>
          <Text style={[textStyles.bannerSubtitle, { marginTop: 10 }]}>
            Quản lý và xem danh sách thời gian đăng ký
          </Text>
        </View>
        <TouchableOpacity
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Nội dung */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : registerTimes.length === 0 ? (
        <View style={layoutStyles.center}>
          <Image
            source={Images.Common.nothing}
            style={imageStyles.emptyImage}
            resizeMode="contain"
          />
          <Text style={textStyles.emptyText}>
            Chưa có thời gian đăng ký nào!
          </Text>
        </View>
      ) : (
        <FlatList
          data={registerTimes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderTimeCard}
          ListFooterComponent={
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <Image
                source={Images.More.img6}
                style={imageStyles.footerImage}
                resizeMode="contain"
              />
              <Text style={textStyles.footerText}>
                Tiếp tục hành trình của bạn!
              </Text>
              <Text style={textStyles.totalText}>
                Tổng số thời gian đăng ký: {registerTimes.length}
              </Text>
            </View>
          }
        />
      )}

      {/* Nút Tạo Thời Gian Đăng Ký - chỉ Admin */}
      {role === 1 && (
        <TouchableOpacity
          accessibilityLabel="add-register-time-button"
          style={buttonStyles.fab}
          onPress={() => openModal()}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Modal chỉ dành cho Admin */}
      {role === 1 && (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={modalStyles.modalContainer}>
            <ScrollView style={modalStyles.modalContent}>
              <Text style={textStyles.modalTitle}>
                {isEditing ? "Cập nhật" : "Thêm"} thời gian
              </Text>

              {/* Date Picker */}
              <TouchableOpacity
                style={inputStyles.dateInput}
                onPress={() => setShowBeginPicker(true)}
              >
                <Text>Bắt đầu: {formatDate(begin)}</Text>
              </TouchableOpacity>
              {showBeginPicker && (
                <DateTimePicker
                  value={begin}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowBeginPicker(Platform.OS === "ios");
                    if (selectedDate) setBegin(selectedDate);
                  }}
                />
              )}

              <TouchableOpacity
                style={inputStyles.dateInput}
                onPress={() => setShowEndPicker(true)}
              >
                <Text>Kết thúc: {formatDate(end)}</Text>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={end}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowEndPicker(Platform.OS === "ios");
                    if (selectedDate) setEnd(selectedDate);
                  }}
                />
              )}

              <TextInput
                style={inputStyles.input}
                placeholder="Năm học"
                keyboardType="numeric"
                value={year}
                onChangeText={setYear}
              />
              <TextInput
                style={inputStyles.input}
                placeholder="Học kỳ"
                keyboardType="numeric"
                value={semester}
                onChangeText={setSemester}
              />

              <TouchableOpacity
                style={buttonStyles.primary}
                onPress={saveRegisterTime}
              >
                <Text style={buttonStyles.primaryText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[buttonStyles.primary, { backgroundColor: "#999" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={buttonStyles.primaryText}>Hủy</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
}