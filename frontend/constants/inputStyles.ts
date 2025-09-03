// constants/inputStyles.ts
import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const inputStyles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 20,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#fafafa",
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 6,
    padding: 10,
    marginVertical: 8,
    backgroundColor: colors.background,
  },
});
