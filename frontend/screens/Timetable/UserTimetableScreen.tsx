import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthService } from "../../services/auth.service";
import { CourseScheduleService } from "../../services/courseschedule.service";
import { colors } from "../../constants/colors";
import Ionicons from "react-native-vector-icons/Ionicons";

// Style constants
import { imageStyles } from "../../constants/imageStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { Images } from "../../constants/images/images";

interface Schedule {
  schedule_id: number;
  date: string;
  start_time: string;
  end_time: string;
  room: string;
  subject_name: string;
  note?: string;
  user_name?: string;
}

export default function TimetableScreen() {
  const navigation = useNavigation<any>();
  const [role, setRole] = useState<number | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7) + weekOffset * 7);

    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day);
    }
    return week;
  };
  const weekDates = getWeekDates();

  const fetchData = async () => {
    try {
      setLoading(true);
      const me = await AuthService.getMe();
      setRole(me.role_id);

      let res: any;
      if (me.role_id === 1) {
        res = await CourseScheduleService.getAllAdmin();
      } else if (me.role_id === 3) {
        res = await CourseScheduleService.getByTeacher();
      } else if (me.role_id === 2) {
        res = await CourseScheduleService.getByStudent();
      }
      setSchedules(res.data || []);
    } catch (error) {
      console.error("Lỗi load timetable:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [weekOffset]);

  const getSchedulesForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return schedules.filter((sch) => sch.date.split("T")[0] === dateStr);
  };

  const daysWithSchedules = weekDates
    .map((day) => ({
      date: day,
      schedules: getSchedulesForDate(day),
    }))
    .filter((item) => item.schedules.length > 0);

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải thời khóa biểu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.subject}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={[layoutStyles.bannerTextContainer, { left: 10 }]}>
          <Text style={[textStyles.bannerTitle, { color: colors.lightYellow }]}>
            THỜI KHÓA BIỂU
          </Text>
          <Text
            style={[
              textStyles.bannerSubtitle,
              { color: colors.primary, marginLeft: 10, marginTop: 40 },
            ]}
          >
            Quản lý thời khóa biểu
          </Text>
        </View>
        {role === 1 && (
          <TouchableOpacity
            style={buttonStyles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <Text
        style={[
          textStyles.listTitle,
          {
            marginBottom: -10,
          },
        ]}
      >
        Thời Khóa Biểu
      </Text>
      {/* Điều hướng tuần */}
      <View style={styles.weekNav}>
        <TouchableOpacity
          onPress={() => setWeekOffset(weekOffset - 1)}
          style={styles.weekBtn}
        >
          <Ionicons name="chevron-back" size={18} color="#fff" />
          <Text style={styles.weekBtnText}>Tuần trước</Text>
        </TouchableOpacity>
        <Text style={styles.weekTitle}>
          {weekDates[0].toLocaleDateString("vi-VN")} -{" "}
          {weekDates[6].toLocaleDateString("vi-VN")}
        </Text>
        <TouchableOpacity
          onPress={() => setWeekOffset(weekOffset + 1)}
          style={styles.weekBtn}
        >
          <Text style={styles.weekBtnText}>Tuần sau</Text>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Danh sách lịch */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 10 }}>
        {daysWithSchedules.length > 0 ? (
          daysWithSchedules.map((item, index) => {
            const dayName = item.date.toLocaleDateString("vi-VN", {
              weekday: "long",
            });
            return (
              <View key={index} style={styles.dayBlock}>
                <Text style={styles.dayTitle}>
                  {dayName.charAt(0).toUpperCase() + dayName.slice(1)} (
                  {item.date.toLocaleDateString("vi-VN")})
                </Text>

                {item.schedules.map((sch) => (
                  <View key={sch.schedule_id} style={styles.scheduleCard}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Ionicons
                        name="book-outline"
                        size={18}
                        color={colors.primary}
                        style={{ marginRight: 5 }}
                      />
                      <Text testID={`subject-name-${sch.schedule_id ?? index}`} style={styles.subject}>{sch.subject_name}</Text>
                    </View>
                    <Text style={styles.info}>
                      🕒 {sch.start_time} - {sch.end_time} | 🏫 {sch.room}
                    </Text>
                    {role === 1 && sch.user_name && (
                      <Text style={styles.info}>
                        👤 Người phụ trách: {sch.user_name}
                      </Text>
                    )}
                    {sch.note && <Text style={styles.note}>📝 {sch.note}</Text>}
                  </View>
                ))}
              </View>
            );
          })
        ) : (
          <Text style={{ textAlign: "center", color: "#999", marginTop: 20 }}>
            Tuần này không có lịch học.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  weekNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  weekBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  weekBtnText: { color: "#fff", fontWeight: "500", fontSize: 13 },
  weekTitle: { fontWeight: "bold", fontSize: 15, color: colors.textDark },
  dayBlock: { marginBottom: 20 },
  dayTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.textDark,
    marginBottom: 8,
  },
  scheduleCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  subject: { fontWeight: "bold", fontSize: 14, color: colors.primary },
  info: { fontSize: 13, color: "#444", marginTop: 3 },
  note: { fontSize: 13, fontStyle: "italic", color: "#666", marginTop: 3 },
});