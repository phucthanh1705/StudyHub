import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { UserService } from "../../services/user.service";

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

interface User {
  id?: number | string;
  name: string;
  email: string;
  password?: string;
  role: string;
}

export default function UserManagementScreen() {
  const navigation = useNavigation();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "student" | "teacher">("student");
  const [searchText, setSearchText] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.getAll();
      const formatted = data.map((u: any, index: number) => ({
        id: u.id || u.user_id || `user-${index}`,
        name: u.name,
        email: u.email,
        role:
          u.role_name?.toLowerCase() ||
          (u.role_id === 1 ? "admin" : u.role_id === 3 ? "teacher" : "student"),
      }));
      setUsers(formatted);
      setFilteredUsers(formatted);
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.message || "Không thể tải danh sách người dùng."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (!text.trim()) {
      setFilteredUsers(users);
    } else {
      const lowerText = text.toLowerCase();
      const filtered = users.filter((u) =>
        u.name.toLowerCase().includes(lowerText)
      );
      setFilteredUsers(filtered);
    }
  };

  const openAddUser = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("student");
    setModalVisible(true);
  };

  const openEditUser = (user: User) => {
    setIsEditing(true);
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword("");
    setRole(user.role as "admin" | "student" | "teacher");
    setModalVisible(true);
  };

  const saveUser = async () => {
    if (!name || !email || (!isEditing && !password)) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tên, email và mật khẩu");
      return;
    }

    try {
      setLoading(true);
      const roleMap: Record<"admin" | "student" | "teacher", number> = {
        admin: 1,
        student: 2,
        teacher: 3,
      };

      if (isEditing && selectedUser?.id) {
        const payload: any = { name, email, role_id: roleMap[role] };
        if (password) payload.password = password;

        await UserService.update(Number(selectedUser.id), payload);
        fetchUsers();
        Alert.alert("Thành công", "Cập nhật người dùng thành công");
      } else {
        const payload = { name, email, password, role_id: roleMap[role] };
        await UserService.create(payload);
        fetchUsers();
        Alert.alert("Thành công", "Thêm người dùng thành công");
      }
      setModalVisible(false);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể lưu người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number | string) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa người dùng này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await UserService.delete(Number(id));
            fetchUsers();
            Alert.alert("Thành công", "Người dùng đã được xóa.");
          } catch (error: any) {
            Alert.alert("Lỗi", error.message || "Xóa người dùng thất bại.");
          }
        },
      },
    ]);
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
          source={Images.TopBanner.schedule}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={[layoutStyles.bannerTextContainer, { left: 20 }]}>
          <Text style={textStyles.bannerTitle}>Người dùng</Text>
          <Text style={textStyles.bannerSubtitle}>
            Quản lý danh sách người dùng của bạn
          </Text>
        </View>
        <TouchableOpacity
          accessibilityLabel="back-button"
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
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

      {/* Nút thêm hình tròn */}
      <TouchableOpacity 
        accessibilityLabel="add-user-button"
        style={buttonStyles.fab} onPress={openAddUser}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Danh sách user */}
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
          keyExtractor={(item) => item.id!.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={cardStyles.card}
              onPress={() => openEditUser(item)}
              activeOpacity={0.9}
            >
              <View style={{ flex: 1 }}>
                <Text style={textStyles.subjectName}>{item.name}</Text>
                <Text style={textStyles.subjectDesc}>{item.email}</Text>
                <Text style={textStyles.subjectDesc}>
                  {`Role: ${item.role}`}
                </Text>
              </View>
              <View style={[cardStyles.cardActions, { marginTop: 5 }]}>
                <TouchableOpacity
                  accessibilityLabel={`edit-user-${item.id}`}
                  style={[
                    buttonStyles.iconBtn,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => openEditUser(item)}
                >
                  <Ionicons name="create-outline" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityLabel={`delete-user-${item.id}`}
                  style={[
                    buttonStyles.iconBtn,
                    { backgroundColor: colors.danger },
                  ]}
                  onPress={() => handleDelete(item.id!)}
                >
                  <Ionicons name="trash-outline" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <View style={{ marginTop: 20, alignItems: "center" }}>
              <Image
                source={Images.More.img2}
                style={imageStyles.footerImage}
                resizeMode="contain"
              />
              <Text style={textStyles.footerText}>
                Quản lý người dùng dễ dàng!
              </Text>
              <Text style={textStyles.totalText}>
                Tổng số tài khoản: {filteredUsers.length}
              </Text>
            </View>
          }
        />
      )}

      {/* Modal thêm/sửa user */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={layoutStyles.modalOverlay}>
          <ScrollView style={[layoutStyles.modalContent, { maxHeight: "60%" }]}>
            <Text
              style={[
                textStyles.modalTitle,
                {
                  textTransform: "uppercase",
                  width: "100%",
                  textAlign: "center",
                },
              ]}
            >
              {isEditing ? "Sửa User" : "Thêm User"}
            </Text>

            <TextInput
              style={textStyles.input}
              placeholder="Tên"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={textStyles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />

            {/* Input mật khẩu có icon xem/ẩn */}
            <View style={{ position: "relative", marginBottom: 10 }}>
              <TextInput
                style={[textStyles.input, { paddingRight: 40 }]}
                placeholder="Mật khẩu"
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 10,
                  top: 12,
                }}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <Text style={textStyles.label}>Role:</Text>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) =>
                setRole(itemValue as "admin" | "student" | "teacher")
              }
              style={{ marginBottom: 10 }}
            >
              <Picker.Item label="Admin" value="admin" />
              <Picker.Item label="Sinh Viên" value="student" />
              <Picker.Item label="Giảng Viên" value="teacher" />
            </Picker>

            <TouchableOpacity
              style={[buttonStyles.primary, { marginBottom: 10 }]}
              onPress={saveUser}
            >
              <Text style={buttonStyles.primaryText}>
                {isEditing ? "Cập nhật" : "Thêm"}
              </Text>
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
    </View>
  );
}