import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { ClassMemberService } from "../../services/classmember.service";

interface CheckoutItem {
  user_id: number;
  user_name: string;
  email: string;
  course_name: string;
  payment_date: string;
  status: string;
}

export default function CheckoutListScreen() {
  const [checkoutList, setCheckoutList] = useState<CheckoutItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Hàm tải danh sách thanh toán
  const fetchCheckoutList = async () => {
    try {
      setLoading(true);
      const data = await ClassMemberService.getPaidList();
      console.log("[DEBUG] Checkout List:", data);
      setCheckoutList(data);
    } catch (err: any) {
      console.error("[CheckoutListScreen] Error:", err);
      Alert.alert("Lỗi", err.message || "Không thể tải danh sách thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckoutList();
  }, []);

  const renderItem = ({ item }: { item: CheckoutItem }) => (
    <View style={styles.item}>
      <Text style={styles.info}>
        {item.user_name} ({item.email})
      </Text>
      <Text style={styles.detail}>Khóa học: {item.course_name}</Text>
      <Text style={styles.detail}>
        Ngày thanh toán: {item.payment_date || "Chưa có thông tin"}
      </Text>
      <Text style={[styles.status, { color: "green" }]}>
        Trạng thái: {item.status || "Đã thanh toán"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Đang tải danh sách thanh toán...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách đã thanh toán</Text>
      {checkoutList.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Chưa có người dùng nào thanh toán.
        </Text>
      ) : (
        <FlatList
          data={checkoutList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  info: { fontSize: 16, fontWeight: "bold" },
  detail: { fontSize: 14, color: "#555", marginTop: 2 },
  status: { fontSize: 14, fontWeight: "bold", marginTop: 5 },
});