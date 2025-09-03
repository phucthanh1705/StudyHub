import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ClassMemberService } from "../../services/classmember.service";
import { RegisterCourseService } from "../../services/registercourse.service";

import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { cardStyles } from "../../constants/cardStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { imageStyles } from "../../constants/imageStyles";
import { colors } from "../../constants/colors";
import { Images } from "../../constants/images/images";

export default function StudentCourseListScreen() {
  const navigation = useNavigation<any>();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [regRes, setRegRes] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("tất cả");

  const fetchData = async () => {
    try {
      setLoading(true);
      const regList = await RegisterCourseService.getMyRegisterCourse();
      setRegRes(regList || []);

      const res = await ClassMemberService.getAvailableCourses();
      setCourses(res.data || res);
      setFilteredCourses(res.data || res);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };
  const fetchByStatus = async (status: string) => {
    if (status === "tất cả") {
      fetchData();
      return;
    }
    try {
      setLoading(true);
      let res;

      if (status === "đã thanh toán") {
        // Gọi API strict để chỉ lấy môn thuộc đúng đợt thanh toán
        res = await ClassMemberService.getByStatusStrict(status);
      } else {
        res = await ClassMemberService.getByStatus(status);
      }

      const filtered = res.data || [];
      setCourses(filtered);
      setFilteredCourses(filtered);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể lọc môn học.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredCourses(courses);
    } else {
      const keyword = search.toLowerCase();
      setFilteredCourses(
        courses.filter(
          (c) =>
            c.name?.toLowerCase().includes(keyword) ||
            c.subject_name?.toLowerCase().includes(keyword)
        )
      );
    }
  }, [search, courses]);

  const toggleSelectCourse = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    fetchByStatus(status);
  };

  const handleAddCourses = async () => {
    try {
      if (selected.length === 0) {
        Alert.alert(
          "Thông báo",
          "Vui lòng chọn ít nhất 1 môn để thêm vào giỏ."
        );
        return;
      }
      for (const courseId of selected) {
        const result = await ClassMemberService.addCourse(courseId);
        if (result?.message && result.data === null) {
          Alert.alert("Thông báo", result.message);
          return;
        }
      }
      Alert.alert("Thành công", "Đã thêm các môn đã chọn vào giỏ.");
      setSelected([]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    }
  };

  // Thời gian đóng học phí hiện tại
  const currentPay = (() => {
    const now = new Date();
    return regRes.find(
      (r) =>
        now >= new Date(r.due_date_start) && now <= new Date(r.due_date_end)
    );
  })();

  // Thời gian đóng học phí dự kiến
  const nextPay = (() => {
    const now = new Date();
    return (
      regRes
        .filter((r) => new Date(r.due_date_start) > now)
        .sort(
          (a, b) =>
            new Date(a.due_date_start).getTime() -
            new Date(b.due_date_start).getTime()
        )[0] || null
    );
  })();

  // Thời gian đăng ký hiện tại
  const currentRegister = (() => {
    const now = new Date();
    return regRes.find(
      (r) =>
        now >= new Date(r.begin_register) && now <= new Date(r.end_register)
    );
  })();

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.studentCourse}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View
          style={[
            layoutStyles.bannerTextContainer,
            { left: "50%", maxWidth: 150 },
          ]}
        >
          <Text style={[textStyles.bannerTitle, { color: "#ffff" }]}>
            Đăng Ký khóa học
          </Text>
          <Text
            style={[
              textStyles.bannerSubtitle,
              { color: "#ffff", marginTop: 10 },
            ]}
          >
            Chọn khóa học phù hợp để thêm vào giỏ
          </Text>
        </View>
      </View>

      {/* Thông tin đóng học phí */}
      {currentPay ? (
        <View
          style={{
            backgroundColor: "#d1f7d1",
            padding: 10,
            borderRadius: 8,
            marginBottom: 10,
            marginTop: 10,
            marginHorizontal: 10,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>
            💵 Đang trong thời gian đóng học phí
          </Text>
          <Text>
            {new Date(currentPay.due_date_start).toLocaleDateString()} →{" "}
            {new Date(currentPay.due_date_end).toLocaleDateString()}
          </Text>
        </View>
      ) : nextPay ? (
        <View
          style={{
            backgroundColor: "#fff8d6",
            padding: 10,
            borderRadius: 8,
            marginBottom: 10,
            marginTop: 10,
            marginHorizontal: 10,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>
            📅 Thời gian đóng học phí dự kiến
          </Text>
          <Text>
            {new Date(nextPay.due_date_start).toLocaleDateString()} →{" "}
            {new Date(nextPay.due_date_end).toLocaleDateString()}
          </Text>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: "#ffe5e5",
            padding: 10,
            borderRadius: 8,
            marginBottom: 10,
            marginTop: 10,
            marginHorizontal: 10,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>
            ❌ Không có thông tin đóng học phí
          </Text>
        </View>
      )}

      {/* Thông tin đăng ký */}
      {currentRegister ? (
        <View
          style={{
            backgroundColor: "#d1f7d1",
            padding: 10,
            borderRadius: 8,
            marginBottom: 10,
            marginTop: 10,
            marginHorizontal: 10,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>
            ✅ Đang trong thời gian đăng ký
          </Text>
          <Text>
            📅 {new Date(currentRegister.begin_register).toLocaleDateString()} →{" "}
            {new Date(currentRegister.end_register).toLocaleDateString()}
          </Text>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: "#ffe5e5",
            padding: 10,
            borderRadius: 8,
            marginBottom: 10,
            marginTop: 10,
            marginHorizontal: 10,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>
            ❌ Không trong thời gian đăng ký
          </Text>
        </View>
      )}

      {/* Nút lọc trạng thái */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 10,
        }}
      >
        {["tất cả", "đang chờ xử lý", "đã thanh toán", "đã hủy môn"].map(
          (status) => (
            <TouchableOpacity
              key={status}
              onPress={() => handleFilterChange(status)}
              style={{
                backgroundColor:
                  filterStatus === status ? colors.primary : "#ccc",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  color: filterStatus === status ? "#fff" : "#000",
                  fontSize: 12,
                }}
              >
                {status}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Ô tìm kiếm */}
      <TextInput
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          borderRadius: 8,
          marginBottom: 10,
          marginHorizontal: 10,
        }}
        placeholder="🔍 Tìm kiếm khóa học..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Danh sách khóa học */}
      <FlatList
        contentContainerStyle={{ paddingBottom: 30 }}
        data={filteredCourses}
        keyExtractor={(item) => item.course_id.toString()}
        ListEmptyComponent={
          <View style={[layoutStyles.center, { marginTop: 30 }]}>
            <Image
              source={Images.Common.nothing}
              style={imageStyles.emptyImage}
              resizeMode="contain"
            />
            <Text style={textStyles.emptyText}>
              Không có khóa học nào phù hợp.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isPaid = item.status === "đã thanh toán";
          return (
            <TouchableOpacity
              disabled={isPaid}
              style={[
                cardStyles.card,
                selected.includes(item.course_id) &&
                  !isPaid && { backgroundColor: "#d1f5d3" },
                isPaid && { opacity: 0.5 },
              ]}
              onPress={() => {
                if (!isPaid) toggleSelectCourse(item.course_id);
              }}
            >
              <Text style={textStyles.subjectName}>
                {item.name || item.subject_name}
              </Text>
              <Text style={textStyles.subjectDesc}>
                Học phí: {item.price?.toLocaleString()} VNĐ
              </Text>
              {isPaid && (
                <Text style={{ color: "red", fontSize: 12 }}>
                  (Đã thanh toán)
                </Text>
              )}
            </TouchableOpacity>
          );
        }}
      />

      {/* Buttons */}
      <TouchableOpacity
        style={[
          buttonStyles.primary,
          { marginBottom: 10, marginHorizontal: 10 },
        ]}
        onPress={handleAddCourses}
      >
        <Text style={buttonStyles.primaryText}>Thêm vào giỏ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          buttonStyles.primary,
          { marginBottom: 20, marginHorizontal: 10 },
        ]}
        onPress={() => navigation.navigate("StudentRegisteredCourses")}
      >
        <Text style={buttonStyles.primaryText}>Xem giỏ môn học</Text>
      </TouchableOpacity>
    </View>
  );
}