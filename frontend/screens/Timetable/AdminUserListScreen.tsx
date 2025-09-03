import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../constants/colors";
import { textStyles } from "../../constants/textStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { cardStyles } from "../../constants/cardStyles";
import { imageStyles } from "../../constants/imageStyles";
import { layoutStyles } from "../../constants/layoutStyles";
import { searchStyles } from "../../constants/searchStyles";
import { Images } from "../../constants/images/images";
import { UserService } from "../../services/user.service";

export default function AdminUserListScreen() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const navigation = useNavigation<any>();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getAll();
      const filtered = data.filter(
        (u: any) => u.role_id === 2 || u.role_id === 3
      );
      setUsers(filtered);
      setFilteredUsers(filtered);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchUsers);
    return unsubscribe;
  }, [navigation]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (!text.trim()) {
      setFilteredUsers(users);
    } else {
      const lower = text.toLowerCase();
      setFilteredUsers(
        users.filter((u) => u.name.toLowerCase().includes(lower))
      );
    }
  };

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải danh sách người dùng...</Text>
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
        <View style={[layoutStyles.bannerTextContainer, { left: 20 }]}>
          <Text
            style={[
              textStyles.bannerTitle,
              { color: colors.textDark, maxWidth: 200 },
            ]}
          >
            QUẢN LÝ THỜI KHÓA BIỂU
          </Text>
          <Text
            style={[
              textStyles.bannerSubtitle,
              { color: colors.textDark, marginTop: 10 },
            ]}
          >
            Quản lý thời khóa biểu của người dùng trong hệ thống
          </Text>
        </View>
      </View>

      <Text style={textStyles.listTitle}>Danh sách người dùng</Text>

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
          placeholder="Tìm kiếm người dùng..."
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Nếu rỗng */}
      {filteredUsers.length === 0 ? (
        <View style={layoutStyles.center}>
          <Image
            source={Images.Common.nothing}
            style={imageStyles.emptyImage}
            resizeMode="contain"
          />
          <Text style={textStyles.emptyText}>Không có người dùng nào!</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[cardStyles.card, { flexDirection: "row" }]}
              onPress={() =>
                navigation.navigate("UserTimetable", {
                  userId: item.user_id,
                  userName: item.name,
                })
              }
              activeOpacity={0.9}
            >
              <View style={{ flex: 1 }}>
                <Text style={textStyles.subjectName}>{item.name}</Text>
                <Text style={textStyles.subjectDesc}>
                  {item.role_id === 2 ? "Student" : "Teacher"}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Image
                source={Images.More.img9}
                style={imageStyles.footerImage}
                resizeMode="contain"
              />
              <Text style={textStyles.footerText}>
                Chọn người dùng để xem thời khóa biểu!
              </Text>
              <Text style={textStyles.totalText}>
                Tổng số người dùng: {filteredUsers.length}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}