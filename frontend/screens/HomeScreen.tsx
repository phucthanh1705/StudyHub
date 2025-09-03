import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { AuthService } from "../services/auth.service";
import { layoutStyles } from "../constants/layoutStyles";
import { textStyles } from "../constants/textStyles";
import { colors } from "../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Images } from "../constants/images/images";

const { width, height } = Dimensions.get("window");
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Avatar helpers
const avatarList = Images.AvatarList;
const getAvatarKey = (userId: number) => `AVATAR_KEY_${userId}`;

// Hero slides data
const heroSlides = [
  {
    id: 1,
    title: "Học tập thông minh\ncùng StudyHub",
    subtitle: "Kết nối tri thức – Nâng tầm tương lai",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Quản lý khóa học\ndễ dàng và hiệu quả",
    subtitle: "Theo dõi, đăng ký và quản lý mọi khóa học của bạn",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    title: "Phát triển bản thân\nmỗi ngày",
    subtitle: "Lên kế hoạch học tập và theo dõi tiến trình",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
  },
];

// Features data
const features = [
  {
    id: 1,
    icon: "📚",
    title: "Quản lý khóa học",
    description:
      "Dễ dàng đăng ký, theo dõi và quản lý danh sách khóa học của bạn",
  },
  {
    id: 2,
    icon: "🗓️",
    title: "Lịch học thông minh",
    description: "Tự động sắp xếp, nhắc nhở và tránh trùng lịch học",
  },
  {
    id: 3,
    icon: "📝",
    title: "Bài tập & Tài liệu",
    description:
      "Theo dõi, nộp bài và truy cập tài liệu học tập mọi lúc mọi nơi",
  },
  {
    id: 4,
    icon: "📊",
    title: "Theo dõi tiến độ",
    description: "Xem kết quả học tập chi tiết để cải thiện kết quả",
  },
];

// Stats data
const stats = [
  { number: "50+", label: "Người dùng", icon: "👥" },
  { number: "100+", label: "Khóa học", icon: "📚" },
  { number: "95%", label: "Hài lòng", icon: "😊" },
  { number: "24/7", label: "Hỗ trợ", icon: "🛟" },
];

// Gallery images
const galleryImages = [
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<any>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef<FlatList>(null);

  const loadAvatar = async (userId: number) => {
    const savedIndex = await AsyncStorage.getItem(getAvatarKey(userId));
    if (savedIndex) {
      setSelectedAvatar(avatarList[parseInt(savedIndex, 10)]);
    }
  };

  const fetchUser = async () => {
    try {
      const data = await AuthService.getMe();
      setUser(data);
      if (data?.user_id) {
        await loadAvatar(data.user_id);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Khi vào lại màn hình Home => load lại avatar & thông tin user
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUser();
    });
    return unsubscribe;
  }, [navigation]);

  // Tự động chuyển slide hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % heroSlides.length;
        slideRef.current?.scrollToIndex({ index: nextSlide, animated: true });
        return nextSlide;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const renderHeroSlide = ({ item }: { item: any }) => (
    <View style={{ width, height: height * 0.6 }}>
      <Image
        source={{ uri: item.image }}
        style={{ width: "100%", height: "100%", position: "absolute" }}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 30,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            marginBottom: 15,
            lineHeight: 40,
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: "white",
            textAlign: "center",
            opacity: 0.9,
            lineHeight: 26,
          }}
        >
          {item.subtitle}
        </Text>
      </View>
    </View>
  );

  const renderFeature = ({ item }: { item: any }) => (
    <View
      style={{
        backgroundColor: "white",
        margin: 10,
        padding: 25,
        borderRadius: 20,
        width: (width - 60) / 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 40, marginBottom: 15 }}>{item.icon}</Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#333",
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        {item.title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#666",
          textAlign: "center",
          lineHeight: 20,
        }}
      >
        {item.description}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[layoutStyles.center, { backgroundColor: colors.primary }]}>
        <ActivityIndicator size="large" color="white" />
        <Text style={[textStyles.subtitle, { color: "white", marginTop: 10 }]}>
          Đang tải StudyHub...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      {/* Hero Section */}
      <View style={{ position: "relative" }}>
        <FlatList
          ref={slideRef}
          data={heroSlides}
          renderItem={renderHeroSlide}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        />

        {/* Floating CTA */}
        <View
          style={{
            position: "absolute",
            bottom: -30,
            left: 30,
            right: 30,
            backgroundColor: "white",
            borderRadius: 25,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 5,
              }}
            >
              {user
                ? `Chào mừng trở lại, ${user.name}!`
                : "Bắt đầu ngay hôm nay"}
            </Text>
            <Text style={{ fontSize: 18, color: "#666" }}>
              {user
                ? "Tiếp tục hành trình học tập"
                : "Tham gia cộng đồng StudyHub"}
            </Text>
          </View>
          {user ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile", { user })}
              style={{ marginLeft: 15 }}
            >
              <Image
                testID="home-avatar"
                source={
                  selectedAvatar
                    ? selectedAvatar
                    : {
                        uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user?.name || "User"
                        )}&background=6C63FF&color=fff&size=128`,
                      }
                }
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  borderWidth: 2,
                  borderColor: colors.primary,
                  backgroundColor: "#eee",
                }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 15,
                paddingVertical: 20,
                borderRadius: 20,
              }}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={{ color: "white", fontWeight: "600", fontSize: 18 }}>
                Đăng nhập
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Stats Section */}
      <View
        style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40 }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          StudyHub trong con số
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {stats.map((stat, index) => (
            <View
              key={index}
              style={{
                width: (width - 60) / 2,
                backgroundColor: "white",
                padding: 25,
                borderRadius: 20,
                alignItems: "center",
                marginBottom: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <Text style={{ fontSize: 30, marginBottom: 10 }}>
                {stat.icon}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: colors.primary,
                  marginBottom: 5,
                }}
              >
                {stat.number}
              </Text>
              <Text
                style={{ fontSize: 16, color: "#666", textAlign: "center" }}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Features Section */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
            marginBottom: 15,
          }}
        >
          Tại sao chọn StudyHub?
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: "#666",
            textAlign: "center",
            marginBottom: 30,
            lineHeight: 24,
          }}
        >
          Khám phá những tính năng vượt trội của StudyHub, giúp bạn học tập
          thông minh hơn, quản lý khóa học dễ dàng, và phát triển bản thân một
          cách toàn diện mỗi ngày.
        </Text>
        <FlatList
          data={features}
          renderItem={renderFeature}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={{ alignItems: "center" }}
        />

        {/* Image Gallery */}
        <View style={{ marginTop: 40 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            {galleryImages.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={{
                  width: width * 0.8,
                  height: 180,
                  borderRadius: 15,
                  marginRight: 15,
                }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Footer */}
      <View
        style={{
          backgroundColor: "#2c3e50",
          padding: 30,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "white",
            marginBottom: 10,
          }}
        >
          StudyHub
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#bdc3c7",
            textAlign: "center",
            marginBottom: 20,
            lineHeight: 24,
          }}
        >
          Nền tảng học tập thông minh{"\n"}Kết nối tri thức - Phát triển tương
          lai
        </Text>
        <Text style={{ fontSize: 12, color: "#95a5a6", textAlign: "center" }}>
          © 2024 StudyHub. Tất cả quyền được bảo lưu.{"\n"}Phiên bản 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}