// constants/modalStyles.ts
import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
});
