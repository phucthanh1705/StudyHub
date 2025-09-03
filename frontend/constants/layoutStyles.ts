// constants/layoutStyles.ts
import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const layoutStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  //-------CONTAINER BANNER TOP----------
  bannerTextContainer: {
    position: "absolute",
    top: 40,
    left: 50,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  bannerWrapper: { position: "relative" },

  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  bottomImageContainer: {
    marginTop: 30,
    alignItems: "center",
  },

  formContainer: { paddingHorizontal: 20 },
  scheduleBlock: {
    backgroundColor: "#f7f7f7",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // làm tối nền
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxHeight: "80%", // tránh modal quá cao
  },
});
