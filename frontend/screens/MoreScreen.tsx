import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

// Import CSS chung
import { colors } from "../constants/colors";
import { layoutStyles } from "../constants/layoutStyles";
import { textStyles } from "../constants/textStyles";
import { cardStyles } from "../constants/cardStyles";
import { imageStyles } from "../constants/imageStyles";

//assets
import { Images } from "../constants/images/images";

export default function MoreScreen() {
  const navigation = useNavigation<any>();

  const adminServices = [
    { icon: "layers-outline", label: "Quản lý môn học", screen: "SubjectList" },

    {
      icon: "calendar-outline",
      label: "Danh sách đăng ký",
      screen: "RegistrationList",
    },
    {
      icon: "time-outline",
      label: "Thời gian đăng ký",
      screen: "RegisterTime",
    },
    {
      icon: "people-outline",
      label: "Quản lý người dùng",
      screen: "UserManagement",
    },
  ];

  return (
    <ScrollView style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.registration}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={[layoutStyles.bannerTextContainer, { left: 10 }]}>
          <Text style={textStyles.bannerTitle}>Dịch Vụ Quản Trị</Text>
          <Text style={textStyles.bannerSubtitle}>
            Quản lý toàn bộ chức năng dành cho Admin
          </Text>
        </View>
      </View>

      {/* Danh sách dịch vụ */}
      <Text style={[textStyles.listTitle, { marginBottom: 10 }]}>
        Danh sách chức năng
      </Text>
      {adminServices.map((service, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            cardStyles.card,
            { flexDirection: "row", alignItems: "center" },
          ]}
          onPress={() => navigation.navigate(service.screen)}
        >
          <Ionicons
            name={service.icon}
            size={24}
            color={colors.primary}
            style={{ marginRight: 10 }}
          />
          <Text style={textStyles.subjectName}>{service.label}</Text>
        </TouchableOpacity>
      ))}

      {/* Footer */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Image
          source={Images.More.img8}
          style={imageStyles.footerImage}
          resizeMode="contain"
        />
        <Text style={textStyles.footerText}>
          Hãy quản lý hệ thống một cách chuyên nghiệp!
        </Text>
      </View>
    </ScrollView>
  );
}