import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../src/contexts/AuthContext";

import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";

import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { imageStyles } from "../../constants/imageStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { inputStyles } from "../../constants/inputStyles";
import { cardStyles } from "../../constants/cardStyles";
import { colors } from "../../constants/colors";
import { Images } from "../../constants/images/images";

// Danh sách avatar
const avatarList = Images.AvatarList;
const getAvatarKey = (userId: number) => `AVATAR_KEY_${userId}`;

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [roleName, setRoleName] = useState("Chưa có");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  // Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Avatar
  const [selectedAvatar, setSelectedAvatar] = useState<any>(null);
  const { setLoggedIn } = useContext(AuthContext);

  const fetchRoleName = async (userId: number) => {
    try {
      const roleData = await UserService.getRoleByUserId(userId);
      if (roleData?.role) setRoleName(roleData.role);
      else if (roleData?.name) setRoleName(roleData.name);
      else setRoleName("Không xác định");
    } catch {
      setRoleName("Không xác định");
    }
  };

  const loadAvatar = async (userId: number) => {
    const savedIndex = await AsyncStorage.getItem(getAvatarKey(userId));
    if (savedIndex) {
      setSelectedAvatar(avatarList[parseInt(savedIndex, 10)]);
    }
  };

  const saveAvatar = async (index: number) => {
    if (!user?.user_id) return;
    await AsyncStorage.setItem(getAvatarKey(user.user_id), index.toString());
    setSelectedAvatar(avatarList[index]);
  };

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const me = await AuthService.getMe();
      setUser(me);
      setName(me.name || "");
      setEmail(me.email || "");
      await fetchRoleName(me.user_id);
      await loadAvatar(me.user_id);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!name || !email) {
      Alert.alert("Lỗi", "Tên và email không được để trống");
      return;
    }
    try {
      setLoading(true);
      await UserService.update(user.user_id, { name, email });
      Alert.alert("Thành công", "Cập nhật thông tin thành công");
      setModalVisible(false);
      fetchUserInfo();
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới và xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      await AuthService.login(user.email, oldPassword);
      await UserService.update(user.user_id, { password: newPassword });
      Alert.alert("Thành công", "Mật khẩu đã được thay đổi");
      setPasswordModalVisible(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Mật khẩu cũ không đúng");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
  try {
    try { await AuthService.logout(); } catch(e) {}
    await AsyncStorage.multiRemove(["token", "me"]);
    setLoggedIn(false);
  } catch (e) {
    Alert.alert("Lỗi", "Đăng xuất không thành công, vui lòng thử lại");
  }
};

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải thông tin người dùng...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.schedule}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={layoutStyles.bannerTextContainer}></View>
        <TouchableOpacity
          accessibilityLabel="back-button"
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={{ alignItems: "center", marginTop: -60 }}>
        <Image
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 3,
            borderColor: "#fff",
            backgroundColor: "#eee",
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 6,
          }}
          source={
            selectedAvatar
              ? selectedAvatar
              : {
                  uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "User"
                  )}&background=6C63FF&color=fff&size=128`,
                }
          }
        />
      </View>
      <Text
        style={[textStyles.title, { marginBottom: 6, textAlign: "center" }]}
      >
        {(user?.name || "").toUpperCase()}
      </Text>
      {/* Thông tin */}
      <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
        <View style={[cardStyles.card, { padding: 20, borderRadius: 16 }]}>
          <Text
            style={[
              textStyles.title,
              {
                marginBottom: 6,
                marginTop: 0,
                textAlign: "center",
                width: "100%",
              },
            ]}
          >
            Thông tin tài khoản
          </Text>
          <Text
            style={[
              textStyles.subtitle,
              { fontSize: 16, textAlign: "center", marginBottom: 15 },
            ]}
          >
            📧Email: {user?.email}
          </Text>
          <Text
            style={[textStyles.subtitle, { fontSize: 16, textAlign: "center" }]}
          >
            🎓 Vai trò: {roleName}
          </Text>

          <TouchableOpacity
            style={[
              buttonStyles.primaryButton,
              { marginTop: 20, width: "100%" },
            ]}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={buttonStyles.primaryText}>Cập nhật thông tin</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Đổi mật khẩu */}
      <TouchableOpacity
        style={[
          buttonStyles.primaryButton,
          {
            marginTop: 15,
            marginHorizontal: 33,
            backgroundColor: colors.lightblue,
          },
        ]}
        onPress={() => setPasswordModalVisible(true)}
      >
        <Ionicons
          name="lock-closed-outline"
          size={18}
          color="#fff"
          style={{ marginRight: 6 }}
        />
        <Text style={buttonStyles.primaryText}>Đổi mật khẩu</Text>
      </TouchableOpacity>

      {/* Đăng xuất */}
      <TouchableOpacity
        style={[
          buttonStyles.primaryButton,
          {
            backgroundColor: colors.danger,
            marginHorizontal: 33,
            marginTop: 15,
          },
        ]}
        onPress={handleLogout}
      >
        <Ionicons
          name="log-out-outline"
          size={18}
          color="#fff"
          style={{ marginRight: 6 }}
        />
        <Text style={buttonStyles.primaryText}>Đăng xuất</Text>
      </TouchableOpacity>

      {/* Modal Cập nhật */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20,
              width: "100%",
              maxWidth: 400,
            }}
          >
            <Text
              style={[
                textStyles.title,
                { textAlign: "center", marginBottom: 10 },
              ]}
            >
              Cập nhật thông tin
            </Text>

            {/* Avatar */}
            <Text style={[textStyles.label, { marginTop: 10 }]}>
              Chọn ảnh đại diện
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginBottom: 10,
              }}
            >
              {avatarList.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => saveAvatar(index)}
                  style={{ margin: 5 }}
                >
                  <Image
                    source={img}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      borderWidth: selectedAvatar === avatarList[index] ? 3 : 1,
                      borderColor:
                        selectedAvatar === avatarList[index]
                          ? colors.primary
                          : "#ccc",
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Input */}
            <Text style={textStyles.label}>Họ và tên</Text>
            <TextInput
              style={inputStyles.input}
              value={name}
              onChangeText={setName}
            />

            <Text style={textStyles.label}>Email</Text>
            <TextInput
              style={inputStyles.input}
              value={email}
              onChangeText={setEmail}
            />

            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <TouchableOpacity
                style={[
                  buttonStyles.primaryButton,
                  { flex: 1, marginRight: 8 },
                ]}
                onPress={handleUpdate}
              >
                <Text style={buttonStyles.primaryText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  buttonStyles.primaryButton,
                  { flex: 1, backgroundColor: colors.gray },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={buttonStyles.primaryText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Đổi mật khẩu */}
      <Modal transparent visible={passwordModalVisible} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20,
              width: "100%",
            }}
          >
            <Text style={[textStyles.title, { textAlign: "center" }]}>
              Đổi mật khẩu
            </Text>

            {/* Mật khẩu hiện tại */}
            <Text style={textStyles.label}>Mật khẩu hiện tại</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                style={[inputStyles.input, { paddingRight: 40 }]}
                secureTextEntry={!showOldPassword}
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="Nhập mật khẩu hiện tại"
              />
              <TouchableOpacity
                onPress={() => setShowOldPassword(!showOldPassword)}
                style={{ position: "absolute", right: 10, top: 12 }}
              >
                <Ionicons
                  name={showOldPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Mật khẩu mới */}
            <Text style={textStyles.label}>Mật khẩu mới</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                style={[inputStyles.input, { paddingRight: 40 }]}
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nhập mật khẩu mới"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={{ position: "absolute", right: 10, top: 12 }}
              >
                <Ionicons
                  name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Xác nhận mật khẩu mới */}
            <Text style={textStyles.label}>Xác nhận mật khẩu mới</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                style={[inputStyles.input, { paddingRight: 40 }]}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Xác nhận mật khẩu mới"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: "absolute", right: 10, top: 12 }}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Nút hành động */}
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <TouchableOpacity
                style={[
                  buttonStyles.primaryButton,
                  { flex: 1, marginRight: 8 },
                ]}
                onPress={handleChangePassword}
              >
                <Text style={buttonStyles.primaryText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  buttonStyles.primaryButton,
                  { flex: 1, backgroundColor: colors.gray },
                ]}
                onPress={() => setPasswordModalVisible(false)}
              >
                <Text style={buttonStyles.primaryText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Footer */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Image
          source={Images.More.img1}
          style={imageStyles.footerImage}
          resizeMode="contain"
        />
        <Text style={textStyles.footerText}>
          Hãy cập nhật thông tin cá nhân để nhận trải nghiệm tốt nhất!
        </Text>
      </View>
    </ScrollView>
  );
}
