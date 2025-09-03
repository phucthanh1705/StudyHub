// constants/textStyles.ts
import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const textStyles = StyleSheet.create({
  //------------TEXT BANNER------------
  bannerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textTransform: "uppercase",
  },
  bannerSubtitle: {
    fontSize: 15,

    marginTop: 35,
    maxWidth: 180,
    textShadowColor: "rgba(0,0,0,0.3)",
    lineHeight: 20,
    fontWeight: "400",
  },
  //-----------TIEU DE DAU MOI LIST--------------
  listTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    paddingVertical: 10,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textDark,
    textAlign: "center",
    paddingVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
  },
  total: {
    textAlign: "center",
    marginVertical: 10,
    color: colors.textLight,
    fontSize: 14,
  },
  error: {
    fontSize: 13,
    color: colors.danger,
    textAlign: "center",
    marginTop: 5,
  },

  subjectName: { fontSize: 16, fontWeight: "bold", color: colors.textDark },
  subjectDesc: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 4,
    maxWidth: "80%",
  },
  emptyText: { fontSize: 16, color: "#888", marginTop: 10 },
  footerText: { fontSize: 14, color: colors.textLight, marginBottom: 5 },
  totalText: { textAlign: "center", marginTop: 5, color: "#555", fontSize: 14 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalDesc: { fontSize: 14, color: colors.textDark, lineHeight: 20 },
  closeBtnText: { color: "#fff", fontWeight: "bold" },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#444",
  },
  addScheduleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  titleSchedule: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#333",
  },
  linkText: {
    color: colors.primary, // Màu chủ đạo (ví dụ xanh)
    fontSize: 15,
    fontWeight: "500",
    textDecorationLine: "underline",
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
});
