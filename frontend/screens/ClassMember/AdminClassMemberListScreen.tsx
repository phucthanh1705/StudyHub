import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { ClassMemberService } from "../../services/classmember.service";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

// Import style chung
import { colors } from "../../constants/colors";
import { textStyles } from "../../constants/textStyles";
import { layoutStyles } from "../../constants/layoutStyles";
import { cardStyles } from "../../constants/cardStyles";
import { imageStyles } from "../../constants/imageStyles";
import { buttonStyles } from "../../constants/buttonStyles";

//assets
import { Images } from "../../constants/images/images";

export default function AdminClassMemberListScreen() {
  const navigation = useNavigation();
  const [classMembers, setClassMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllClassMembers = async () => {
    try {
      setLoading(true);
      const res = await ClassMemberService.getAllClassMembers();
      setClassMembers(res.data || []);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải danh sách classmember");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllClassMembers();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View
      style={[
        cardStyles.card,
        { flexDirection: "column", alignItems: "flex-start" },
      ]}
    >
      <Text style={textStyles.subjectName}>
        {item.name} (UserID: {item.user_id})
      </Text>
      <Text style={[textStyles.subjectDesc, { marginTop: 4 }]}>
        Môn học: {item.subject_name}
      </Text>
      <Text
        style={[
          textStyles.subjectDesc,
          { color: "red", fontWeight: "600", marginTop: 4 },
        ]}
      >
        Giá: {item.price.toLocaleString("vi-VN")}
      </Text>
      <Text style={[textStyles.subjectDesc, { marginTop: 4 }]}>
        Trạng thái: {item.status}
      </Text>
      <Text style={[textStyles.subjectDesc, { marginTop: 4 }]}>
        Hạn đóng: {new Date(item.due_date_end).toLocaleDateString("vi-VN")}
      </Text>
    </View>
  );

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
          source={Images.TopBanner.adminClassMember}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={layoutStyles.bannerTextContainer}>
          <Text style={textStyles.bannerTitle}>Class Members</Text>
          <Text style={textStyles.bannerSubtitle}>
            Quản lý danh sách sinh viên đăng ký môn học
          </Text>
        </View>
        <TouchableOpacity
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={textStyles.listTitle}>Danh sách ClassMember</Text>

      {classMembers.length === 0 ? (
        <View style={layoutStyles.center}>
          <Image
            source={Images.Common.nothing}
            style={imageStyles.emptyImage}
            resizeMode="contain"
          />
          <Text style={textStyles.emptyText}>
            Hiện chưa có sinh viên đăng ký môn học nào.
          </Text>
        </View>
      ) : (
        <FlatList
          data={classMembers}
          keyExtractor={(item, index) => `${item.user_id}-${index}`}
          renderItem={renderItem}
          ListFooterComponent={
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <Image
                source={Images.More.img8}
                style={imageStyles.footerImage}
                resizeMode="contain"
              />
              <Text style={textStyles.footerText}>
                Tiếp tục hành trình của bạn!
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}