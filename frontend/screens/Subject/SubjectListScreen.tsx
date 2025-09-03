import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { SubjectService } from "../../services/subject.service";

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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Subject {
  subject_id: number;
  name: string;
  description?: string;
}

export default function SubjectListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const data = await SubjectService.getAll();
      setSubjects(data);
      setFilteredSubjects(data);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải danh sách môn học.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchSubjects);
    return unsubscribe;
  }, [navigation]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (!text.trim()) {
      setFilteredSubjects(subjects);
    } else {
      const lowerText = text.toLowerCase();
      const filtered = subjects.filter((s) =>
        s.name.toLowerCase().includes(lowerText)
      );
      setFilteredSubjects(filtered);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa môn học này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await SubjectService.delete(id);
            Alert.alert("Thành công", "Môn học đã được xóa.");
            fetchSubjects();
          } catch (error: any) {
            Alert.alert("Lỗi", error.message || "Xóa môn học thất bại.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải danh sách môn học...</Text>
      </View>
    );
  }

  return (
    <View style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.subject}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={layoutStyles.bannerTextContainer}>
          <Text style={[textStyles.bannerTitle, { color: colors.lightYellow }]}>
            Môn học
          </Text>
          <Text style={[textStyles.bannerSubtitle, { color: colors.primary }]}>
            Quản lý danh sách các môn học của bạn
          </Text>
        </View>
        <TouchableOpacity
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={textStyles.listTitle}>Danh sách môn học </Text>

      {/* Thanh tìm kiếm */}
      <View style={searchStyles.searchWrapper}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={searchStyles.searchIcon}
        />
        <TextInput
          style={searchStyles.searchInput}
          placeholder="Tìm kiếm môn học..."
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Nút thêm hình tròn */}
      <TouchableOpacity
        accessibilityLabel={`addSubject`}
        style={buttonStyles.fab}
        onPress={() => navigation.navigate("AddSubject")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Nếu không có subject */}
      {filteredSubjects.length === 0 ? (
        <View style={layoutStyles.center}>
          <Image
            source={Images.Common.nothing}
            style={imageStyles.emptyImage}
            resizeMode="contain"
          />
          <Text style={textStyles.emptyText}>Không có môn học nào!</Text>
        </View>
      ) : (
        <>
          {/* Danh sách môn học */}
          <FlatList
            data={filteredSubjects}
            keyExtractor={(item) => item.subject_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[cardStyles.card, { flexDirection: "row" }]}
                onPress={() => setSelectedSubject(item)}
                activeOpacity={0.9}
              >
                <View style={{ flex: 1 }}>
                  <Text style={textStyles.subjectName}>{item.name}</Text>
                  {item.description ? (
                    <Text
                      style={textStyles.subjectDesc}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.description}
                    </Text>
                  ) : null}
                </View>
                <View style={cardStyles.cardActions}>
                  <TouchableOpacity
                    accessibilityLabel={`edit-${item.subject_id}`}
                    style={[
                      buttonStyles.iconBtn,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={() =>
                      navigation.navigate("EditSubject", {
                        id: item.subject_id,
                      })
                    }
                  >
                    <Ionicons name="create-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    accessibilityLabel={`delete-${item.subject_id}`}
                    style={[
                      buttonStyles.iconBtn,
                      { backgroundColor: colors.danger },
                    ]}
                    onPress={() => handleDelete(item.subject_id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            ListFooterComponent={
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
                  Tiếp tục hành trình của bạn!
                </Text>
                <Text style={textStyles.totalText}>
                  Tổng số môn học: {filteredSubjects.length}
                </Text>
              </View>
            }
          />
        </>
      )}

      {/* Modal xem chi tiết môn học */}
      {selectedSubject && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedSubject}
          onRequestClose={() => setSelectedSubject(null)}
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
              <Text style={textStyles.modalTitle}>{selectedSubject.name}</Text>

              {/* ScrollView với maxHeight để không đẩy nút */}
              <ScrollView style={{ maxHeight: 300, marginBottom: 20 }}>
                <Text style={textStyles.modalDesc}>
                  {selectedSubject.description || "Không có mô tả."}
                </Text>
              </ScrollView>

              {/* Nút Đóng */}
              <TouchableOpacity
                style={buttonStyles.closeBtn}
                onPress={() => setSelectedSubject(null)}
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