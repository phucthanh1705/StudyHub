import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { RegisterCourseService } from "../../services/registercourse.service";
import Ionicons from "react-native-vector-icons/Ionicons";

// Styles
import { colors } from "../../constants/colors";
import { textStyles } from "../../constants/textStyles";
import { layoutStyles } from "../../constants/layoutStyles";
import { cardStyles } from "../../constants/cardStyles";
import { imageStyles } from "../../constants/imageStyles";
import { buttonStyles } from "../../constants/buttonStyles";

// Assets
import { Images } from "../../constants/images/images";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RegistrationList"
>;

interface RegisterCourse {
  register_id: number;
  begin_register: string;
  end_register: string;
  tuition: number;
  status: string;
  semester: number;
  year: number;
  course_id: number;
  user_id: number;
  user_name: string;
  email: string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

export default function RegistrationListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [registerCourses, setRegisterCourses] = useState<RegisterCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<RegisterCourse[]>([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc
  const [semesterFilter, setSemesterFilter] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");

  const fetchRegisterCourses = async () => {
    try {
      setLoading(true);
      const data = await RegisterCourseService.getAll();
      setRegisterCourses(data);
      setFilteredCourses(data);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải danh sách đăng ký.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisterCourses();
  }, []);

  // Hàm lọc dữ liệu
  useEffect(() => {
    let filtered = [...registerCourses];

    // Lọc theo học kỳ
    if (semesterFilter !== null) {
      filtered = filtered.filter(
        (item) => Number(item.semester) === semesterFilter
      );
    }

    // Lọc theo tên người dùng
    if (searchText.trim()) {
      const lowerText = searchText.toLowerCase();
      filtered = filtered.filter((item) =>
        item.user_name.toLowerCase().includes(lowerText)
      );
    }

    setFilteredCourses(filtered);
  }, [semesterFilter, searchText, registerCourses]);

  const renderItem = ({ item }: { item: RegisterCourse }) => (
    <TouchableOpacity
      style={cardStyles.card}
      onPress={() =>
        navigation.navigate("RegisterCourseDetail", {
          registerId: item.register_id,
        })
      }
    >
      <View style={{ flex: 1 }}>
        <Text style={textStyles.subjectName}>
          Đăng ký học kỳ {item.semester}/{item.year}
        </Text>
        <Text style={textStyles.subjectDesc}>
          Người dùng: {item.user_name} ({item.email})
        </Text>
        <Text style={textStyles.subjectDesc}>
          Thời gian đăng ký: {formatDate(item.begin_register)} -{" "}
          {formatDate(item.end_register)}
        </Text>
        <Text style={[textStyles.subjectDesc, { color: colors.primary }]}>
          Trạng thái: {item.status || "Chưa xác định"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải danh sách đăng ký...</Text>
      </View>
    );
  }

  return (
    <View style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.registration}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={layoutStyles.bannerTextContainer}>
          <Text style={textStyles.bannerTitle}>Đăng ký</Text>
          <Text style={textStyles.bannerSubtitle}>
            Quản lý danh sách đăng ký khóa học của bạn
          </Text>
        </View>
        <TouchableOpacity
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Thanh tìm kiếm */}
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          paddingHorizontal: 10,
          marginHorizontal: 15,
          marginTop: 10,
          marginBottom: 15,
        }}
        placeholder="Tìm kiếm theo tên người dùng..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Lọc theo Học kỳ */}
      <View style={{ marginHorizontal: 15, marginBottom: 15 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 8, fontSize: 16 }}>
          Lọc theo Học kỳ
        </Text>
        <View style={{ flexDirection: "row" }}>
          {[1, 2, 3].map((sem) => (
            <TouchableOpacity
              key={sem}
              style={[filterBtn, semesterFilter === sem && filterBtnActive]}
              onPress={() => setSemesterFilter(sem)}
            >
              <Text
                style={[
                  filterBtnText,
                  semesterFilter === sem && filterBtnTextActive,
                ]}
              >
                Học kỳ {sem}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Danh sách */}
      {filteredCourses.length === 0 ? (
        <View style={layoutStyles.center}>
          <Image
            source={Images.Common.nothing}
            style={imageStyles.emptyImage}
            resizeMode="contain"
          />
          <Text style={textStyles.emptyText}>Không tìm thấy kết quả.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={(item, index) =>
            (item?.register_id ?? index).toString()
          }
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const filterBtn = {
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#ccc",
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 20,
  marginRight: 10,
};

const filterBtnActive = {
  backgroundColor: colors.primary,
  borderColor: colors.primary,
};

const filterBtnText = {
  fontSize: 14,
  color: "#333",
};

const filterBtnTextActive = {
  color: "#fff",
  fontWeight: "bold" as const,
};